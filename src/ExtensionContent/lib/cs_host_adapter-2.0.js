/*
ADOBE SYSTEMS INCORPORATED
Copyright 2013 Adobe Systems Incorporated. All Rights Reserved.

NOTICE:  Adobe permits you to use, modify, and distribute this file in 
accordance with the terms of the Adobe license agreement accompanying it.  
If you have received this file from a source other than Adobe, then your 
use, modification, or distribution of it requires the prior written 
permission of Adobe.
*/
 
/**
 * EventAdapter provides the base implementation for Creative Cloud
 * application-specific event adapter libraries.
 * 
 * EventAdapter should not be instantiated directly to communicate with a host
 * application. Instead, use the application-specific inheritance of this object.
 * For example, to register listeners for Photoshop events, use the
 * PSEventAdapter.
 */
function EventAdapter(adapterNamespace) 
{
	// Assigned in constructor, vary according to subclass's namespace
	this.ADD_EVENT_LISTENER_EVENT = this.initQualifiedEventName(adapterNamespace, EventAdapter.ADD_EVENT_LISTENER_EVENT_NAME);
    this.REMOVE_EVENT_LISTENER_EVENT = this.initQualifiedEventName(adapterNamespace, EventAdapter.REMOVE_EVENT_LISTENER_EVENT_NAME);
    this.CPP_CS_EVENT_EVENT = this.initQualifiedEventName(adapterNamespace, EventAdapter.CPP_CS_EVENT_EVENT_NAME);
    this.PING_REQUEST_EVENT = this.initQualifiedEventName(adapterNamespace, EventAdapter.PING_REQUEST_EVENT_NAME); 
    this.PING_RESPONSE_EVENT = this.initQualifiedEventName(adapterNamespace, EventAdapter.PING_RESPONSE_EVENT_NAME);
	this.LIST_EVENTS_REQUEST_EVENT = this.initQualifiedEventName(adapterNamespace, EventAdapter.LIST_EVENTS_REQUEST_EVENT_NAME); 
	this.LIST_EVENTS_RESPONSE_EVENT = this.initQualifiedEventName(adapterNamespace, EventAdapter.LIST_EVENTS_RESPONSE_EVENT_NAME);
	
	this.dispatcherDelegate = this;
	
	this.userPingResponseHandler;
	this.pingStarted;
	this.userListEventsResponseHandler;
	
	this.csInterface = new CSInterface();
	
	this.eventListening = {};
	this.CPP_CS_EVENT_EVENT_added = false;
}

EventAdapter.ADD_EVENT_LISTENER_EVENT_NAME = "AddEventListener";
EventAdapter.REMOVE_EVENT_LISTENER_EVENT_NAME = "RemoveEventListener";
EventAdapter.CPP_CS_EVENT_EVENT_NAME = "CppEvent";
EventAdapter.PING_REQUEST_EVENT_NAME = "PingRequestEvent";
EventAdapter.PING_RESPONSE_EVENT_NAME = "PingResponseEvent";
EventAdapter.LIST_EVENTS_REQUEST_EVENT_NAME = "ListEventsRequestEvent";
EventAdapter.LIST_EVENTS_RESPONSE_EVENT_NAME = "ListEventsResponseEvent";

EventAdapter.prototype.initQualifiedEventName = function(ns, eventName)
{
	return ns + "." + eventName;
};

/**
 * Sends a 'ping' message to the host adapter plug-in and dispatches the response
 * to the specified handler.
 * 
 * A PingEvent is dispatched to responseHandler either when a response 
 * is received from the plug-in or after the specified timeout period.
 *  
 * his method provides a means of checking whether the required host adapter 
 * plug-in has been loaded by the host application, and therefore whether 
 * this library can be used to register event listeners.
 * 
 * @param responseHandler A listener function to which the resulting PingEvent
 * will be dispatched
 * @param timeout The number of milliseconds to wait for a response from the host adapter 
 * plug-in before it is considered not to be loaded
 */
EventAdapter.prototype.pingPlugIn = function(responseHandler, timeout)
{
	if (isNaN(timeout))
		timeout = 5000;
		
	var adapter = this;
	
	// Only do ping if another ping is not already pending
	if (! this.pingStarted)
	{
		this.userPingResponseHandler = responseHandler;
		this.csInterface.addEventListener(this.PING_RESPONSE_EVENT, pingResponseHandler);
		
		// Ping the plug-in
		setTimeout(
		    function(){adapter.dispatchToEventAdapter(adapter.PING_REQUEST_EVENT);}, 
			timeout);
		this.pingStarted = true;
	}
	else
	{
		alert("[EventAdapter]: Failed to ping plug-in - another ping response is pending");
	}
	
	function pingResponseHandler(event)
	{
		adapter.csInterface.removeEventListener(adapter.PING_RESPONSE_EVENT, pingResponseHandler);
		
		// If event type is adapter.PING_RESPONSE_EVENT, we received ping, else ping timed out
		var eventType = (event.type == adapter.PING_RESPONSE_EVENT) ? 
			PingEvent.PING_SUCCEEDED : PingEvent.PING_TIMED_OUT;
		
		// Dispatch event to user's ping event handler
		adapter.userPingResponseHandler(new PingEvent(eventType));

		adapter.pingStarted = false;
	}
};

/**
 * Helper method for subclasses which dispatches a CS event with the 
 * specified type and XML payload.
 * 
 * @param type the type of the CS event to dispatch
 * @param payload the data of the CS event, in well-formed XML 
 */
EventAdapter.prototype.dispatchToEventAdapter = function(type, payload)
{
	var e = new CSEvent(type,	
		"GLOBAL",this.csInterface.getApplicationID());
	e.data = payload;
	this.csInterface.dispatchEvent(e);
};

EventAdapter.prototype.hasEventListener = function(eventType) {
	return this.eventListening[eventType];
};

/**
 * Registers a listener for the specified event, so that the 
 * listener receives notification of the event.
 * 
 * The set of allowed values for eventType varies depending on which 
 * Creative Cloud application is being targeted. The type of event 
 * dispatched to the listener will also vary depending on the target 
 * application.
 *
 * @param eventType The unique string identifier of the event to listen for.
 * @param listener The listener function that processes the event.
 */ 
EventAdapter.prototype.addEventListener = function(eventType, listener, useCapture, priority, useWeakReference)
{
	useCapture = useCapture === undefined ? false : useCapture;
	priority = priority === undefined ? 0 : priority;
	useWeakReference = useWeakReference === undefined ? false : useWeakReference;
	
	// Are we currently listening for the specified event type?
	// If not, we'll need to tell the plug-in to start listening for it
	var alreadyListening = this.hasEventListener(eventType);
	var listeners = alreadyListening ? this.eventListening[eventType] : {};
	listeners[listener] = listener;
	this.eventListening[eventType] = listeners;
	
	var adapter = this;
	
	if (!this.CPP_CS_EVENT_EVENT_added) {
	    this.CPP_CS_EVENT_EVENT_added = true;
	    this.csInterface.addEventListener(this.CPP_CS_EVENT_EVENT,
		    function (evt) {adapter.eventForwarder(evt);});
	}
		
	
	// If required, tell plug-in to register listener
	if (!alreadyListening)
		this.dispatchToEventAdapter(this.ADD_EVENT_LISTENER_EVENT, eventType);
};

/**
 * Called when an event is received from the plug-in. Extracts the data
 * sent from the plug-in, creates a corresponding event and 
 * dispatches it to the client.
 */
EventAdapter.prototype.eventForwarder = function(event)
{
	var appEvent = this.createAppEvent(event);
	var listeners = this.eventListening[appEvent.type];
    if (listeners) {
	    for (var listener in listeners)
	        listeners[listener].call(this, appEvent);
	}
};

/**
 * This method must be overridden by subclasses, or it will
 * throw an Error. It is called whenever a CS event is received from
 * the host adapter plug-in which requires translation.
 * 
 * @param event The CS event to translate
 * @return The translated event to dispatch
 */
EventAdapter.prototype.createAppEvent = function(event)
{
	throw new Error("EventAdapter.createAppEvent(..) must be overridden by subclasses");
};

/**
 * Removes an event listener for the specified event.
 * 
 * If no matching listener is registered with this event adapter, 
 * a call to this method has no effect.
 *
 * @param eventType The event type to remove the listener for
 * @param listener The listener object to remove
 * 
 */
EventAdapter.prototype.removeEventListener = function(eventType, listener, useCapture)
{
	useCapture = useCapture === undefined ? false : useCapture;
	
	var wasListening = this.hasEventListener(eventType);
	
	if (! wasListening)
	    return;
	
	var listeners = this.eventListening[eventType];
	var size = 0;
	
	if (listeners) {
	    if (listeners && listeners[listener]) {
	        delete listeners[listener];
		}
		
	    if (listeners) {
	        for (var key in listeners) {
	        	if (listeners.hasOwnProperty(key))
		            size++;
		    }
	    }
	}
	
	if (size == 0) {
	    delete this.eventListening[eventType];
	}
	
	// If we were listening for the event before, but now we're
	// not, then tell the plug-in to stop listening for it
	if(wasListening && !this.hasEventListener(eventType))
		this.dispatchToEventAdapter(this.REMOVE_EVENT_LISTENER_EVENT, eventType);
};

/**
 * Obtains a list of the events for which the host adapter plug-in is 
 * currently listening.
 * 
 * A ListEventsEvent is dispatched to responseHandler when the list of 
 * events is received from the host adapter plug-in.
 *  
 * This method provides a means of checking whether an event listener was 
 * successfully added or removed by the host adapter plug-in.
 * 
 * @param responseHandler A listener function to which the resulting 
 * ListEventsEvent will be dispatched
 */
EventAdapter.prototype.listEvents = function(responseHandler)
{
	this.userListEventsResponseHandler = responseHandler;
	this.csInterface.addEventListener(this.LIST_EVENTS_RESPONSE_EVENT, listEventsResponseHandler);
	this.dispatchToEventAdapter(this.LIST_EVENTS_REQUEST_EVENT);
	var adapter = this;
	
	function listEventsResponseHandler(evt)
	{
		adapter.csInterface.removeEventListener(adapter.LIST_EVENTS_RESPONSE_EVENT, listEventsResponseHandler);
		
		// Extract events data from event XML payload 
		var eventsArray = [];

		var parser = new DOMParser();
        var xmlDoc  = parser.parseFromString(evt.data.replace("<![CDATA[", "").replace("]]>", ""), "text/xml");
		var events = xmlDoc.firstChild.childNodes;
		for (var i = 0; i < events.length; i++)
		{
		    eventsArray.push(events[i].getAttribute("id"));
		}
		
		var eventToDispatch = new ListEventsEvent(ListEventsEvent.LIST, eventsArray);
		adapter.userListEventsResponseHandler(eventToDispatch);
	}
};

/**
 * Dispatched when a ping response is received from a host adapter 
 * plug-in, or when a ping request times out.
 * 
 */
function PingEvent(type)
{
	this.type = type;
}

/**
 * Defines the value of the type property of a ping_succeeded
 * event object.
 * 
 */
PingEvent.PING_SUCCEEDED = "pingSucceeded";

/**
 * Defines the value of the type property of a ping_timed_out 
 * event object.
 * 
 */
PingEvent.PING_TIMED_OUT = "pingTimedOut";

/**
 * Dispatched when a "list events" response is received from a host 
 * adapter plug-in.
 * 
 * The list property of this event contains a list of the
 * events which the host adapter was listening for at the time of 
 * event dispatch.
 * 
 * Constructs a ListEventsEvent with the specified type and event list array.
 * 
 * @param type	The ListEventsEvent type
 * @param list	The list of events the host adapter is listening for
 */
function ListEventsEvent(type, list)
{
	this.type = type;
	this._list = list;
};

/**
 * Defines the value of the type property of a ping_succeeded
 * event object.
 * 
 */
ListEventsEvent.LIST = "listEvents";

/**
 * The list of events being listened for by the host adapter plug-in 
 * which triggered this event. Typically each item in the array is a 
 * String representing an event's unique identifier, however this may
 * vary between host applications.
 * 
 */
ListEventsEvent.prototype.list = function()
{
	return this._list;
};

/**
 * Represents an event which occurred in Photoshop. Provides a set of event 
 * types which may be listened for via PSEventAdapter.addEventListener(...).
 *
 * Constructs a new PSEvent with the specified type. The type should be a 
 * String representation of the event's Photoshop runtime ID.
 * 
 * @see PSEventAdapter
 */
function PSEvent(type)
{
	this.type = type;
}

PSEvent._3DTRANSFORM = "1415861280";
PSEvent.AVERAGE = "1098281575";
PSEvent.APPLY_STYLE = "1095988345";
PSEvent.ASSERT = "1098084980";
PSEvent.ACCENTED_EDGES = "1097032517";
PSEvent.ADD = "1097098272";
PSEvent.ADD_NOISE = "1097092723";
PSEvent.ADD_TO = "1097098324";
PSEvent.ALIGN = "1097623406";
PSEvent.ALL = "1097624608";
PSEvent.ANGLED_STROKES = "1097754451";
PSEvent.APPLY_IMAGE = "1097887817";
PSEvent.BAS_RELIEF = "1114853996";
PSEvent.BATCH = "1114923880";
PSEvent.BATCH_FROM_DROPLET = "1114923846";
PSEvent.BLUR = "1114403360";
PSEvent.BLUR_MORE = "1114403405";
PSEvent.BORDER = "1114793074";
PSEvent.BRIGHTNESS = "1114793795";
PSEvent.CANVAS_SIZE = "1131312723";
PSEvent.CHALK_CHARCOAL = "1130916931";
PSEvent.CHANNEL_MIXER = "1130917453";
PSEvent.CHARCOAL = "1130918499";
PSEvent.CHROME = "1130918509";
PSEvent.CLEAR = "1131177330";
PSEvent.CLOSE = "1131180832";
PSEvent.CLOUDS = "1131177075";
PSEvent.COLOR_BALANCE = "1131180610";
PSEvent.COLOR_HALFTONE = "1131180616";
PSEvent.COLOR_RANGE = "1131180626";
PSEvent.COLORED_PENCIL = "1131180624";
PSEvent.CONTE_CRAYON = "1131312195";
PSEvent.CONTRACT = "1131312227";
PSEvent.CONVERT_MODE = "1131312717";
PSEvent.COPY = "1668247673";
PSEvent.COPY_EFFECTS = "1131431512";
PSEvent.COPY_MERGED = "1131444557";
PSEvent.COPY_TO_LAYER = "1131435084";
PSEvent.CRAQUELURE = "1131573612";
PSEvent.CREATE_DROPLET = "1131574340";
PSEvent.CROP = "1131573104";
PSEvent.CROSSHATCH = "1131574120";
PSEvent.CRYSTALLIZE = "1131574132";
PSEvent.CURVES = "1131574899";
PSEvent.CUSTOM = "1131639917";
PSEvent.CUT = "1668641824";
PSEvent.CUT_TO_LAYER = "1131697228";
PSEvent.CUTOUT = "1131683872";
PSEvent.DARK_STROKES = "1148349267";
PSEvent.DE_INTERLACE = "1148089458";
PSEvent.DEFINE_PATTERN = "1147563600";
PSEvent.DEFRINGE = "1147564647";
PSEvent.DELETE = "1147958304";
PSEvent.DESATURATE = "1148417140";
PSEvent.DESELECT = "1148415075";
PSEvent.DESPECKLE = "1148416099";
PSEvent.DIFFERENCE_CLOUDS = "1147564611";
PSEvent.DIFFUSE = "1147564832";
PSEvent.DIFFUSE_GLOW = "1147564871";
PSEvent.DISABLE_LAYER_FX = "1684825720";
PSEvent.DISPLACE = "1148416108";
PSEvent.DISTRIBUTE = "1148417138";
PSEvent.DRAW = "1148346743";
PSEvent.DRY_BRUSH = "1148352834";
PSEvent.DUPLICATE = "1148218467";
PSEvent.DUST_AND_SCRATCHES = "1148417107";
PSEvent.EMBOSS = "1164796531";
PSEvent.EQUALIZE = "1165061242";
PSEvent.EXCHANGE = "1165517672";
PSEvent.EXPAND = "1165521006";
PSEvent.EXPORT = "1165521010";
PSEvent.EXTRUDE = "1165522034";
PSEvent.FACET = "1180922912";
PSEvent.FADE = "1180787813";
PSEvent.FEATHER = "1182034034";
PSEvent.FIBERS = "1180856947";
PSEvent.FILL = "1181491232";
PSEvent.FILM_GRAIN = "1181510983";
PSEvent.FILTER = "1181512818";
PSEvent.FIND_EDGES = "1181639749";
PSEvent.FLATTEN_IMAGE = "1181512777";
PSEvent.FLIP = "1181510000";
PSEvent.FRAGMENT = "1181902701";
PSEvent.FRESCO = "1181905763";
PSEvent.GAUSSIAN_BLUR = "1198747202";
PSEvent.GET = "1734702180";
PSEvent.GLASS = "1198289696";
PSEvent.GLOWING_EDGES = "1198290757";
PSEvent.GRADIENT = "1198679150";
PSEvent.GRADIENT_MAP = "1198673264";
PSEvent.GRAIN = "1198681632";
PSEvent.GRAPHIC_PEN = "1198678352";
PSEvent.GROUP = "1198682188";
PSEvent.GROW = "1198681975";
PSEvent.HALFTONE_SCREEN = "1215063635";
PSEvent.HIDE = "1214521376";
PSEvent.HIGH_PASS = "1214736464";
PSEvent.HSBHSL = "1215521360";
PSEvent.HUE_SATURATION = "1213428850";
PSEvent.IMAGE_SIZE = "1231906643";
PSEvent.IMPORT = "1231908978";
PSEvent.INK_OUTLINES = "1231973199";
PSEvent.INTERSECT = "1231975538";
PSEvent.INTERSECT_WITH = "1231975511";
PSEvent.INVERSE = "1231976051";
PSEvent.INVERT = "1231976050";
PSEvent.LENS_FLARE = "1282306886";
PSEvent.LEVELS = "1282829427";
PSEvent.LIGHTING_EFFECTS = "1281845317";
PSEvent.LINK = "1282304800";
PSEvent.MAKE = "1298866208";
PSEvent.MAXIMUM = "1299737888";
PSEvent.MEDIAN = "1298427424";
PSEvent.MERGE_LAYERS = "1299343154";
PSEvent.MERGE_LAYERS_OLD = "1299343180";
PSEvent.MERGE_SPOT_CHANNEL = "1297313908";
PSEvent.MERGE_VISIBLE = "1299343190";
PSEvent.MEZZOTINT = "1299870830";
PSEvent.MINIMUM = "1299082528";
PSEvent.MOSAIC = "1299407648";
PSEvent.MOSAIC_PLUGIN = "1299407700";
PSEvent.MOTION_BLUR = "1299476034";
PSEvent.MOVE = "1836021349";
PSEvent.NTSCCOLORS = "1314149187";
PSEvent.NEON_GLOW = "1313303671";
PSEvent.NEXT = "1316516896";
PSEvent.NOTE_PAPER = "1316245618";
PSEvent.NOTIFY = "1316251257";
PSEvent.OCEAN_RIPPLE = "1331916370";
PSEvent.OFFSET = "1332114292";
PSEvent.OPEN = "1332768288";
PSEvent.PAINT = "1349415968";
PSEvent.PAINT_DAUBS = "1349416004";
PSEvent.PALETTE_KNIFE = "1349284939";
PSEvent.PASTE = "1885434740";
PSEvent.PASTE_EFFECTS = "1348552280";
PSEvent.PASTE_INTO = "1349743689";
PSEvent.PASTE_OUTSIDE = "1349743695";
PSEvent.PATCHWORK = "1349804904";
PSEvent.PHOTOCOPY = "1349022819";
PSEvent.PINCH = "1349411688";
PSEvent.PLACE = "1349280544";
PSEvent.PLASTER = "1349284724";
PSEvent.PLASTIC_WRAP = "1349284695";
PSEvent.PLAY = "1349286176";
PSEvent.POINTILLIZE = "1349416044";
PSEvent.POLAR = "1349284384";
PSEvent.POSTER_EDGES = "1349743685";
PSEvent.POSTERIZE = "1349743730";
PSEvent.PREVIOUS = "1349678707";
PSEvent.PRINT = "1349676660";
PSEvent.PROFILE_TO_PROFILE = "1349674580";
PSEvent.PURGE = "1349674853";
PSEvent.QUIT = "1903520116";
PSEvent.RADIAL_BLUR = "1382313026";
PSEvent.RASTERIZE = "1383298162";
PSEvent.RASTERIZE_TYPE_SHEET = "1383298132";
PSEvent.REMOVE_BLACK_MATTE = "1382905410";
PSEvent.REMOVE_LAYER_MASK = "1382905420";
PSEvent.REMOVE_WHITE_MATTE = "1382905431";
PSEvent.RENAME = "1382968608";
PSEvent.REPLACE_COLOR = "1383099459";
PSEvent.RESET = "1383294324";
PSEvent.RETICULATION = "1383359340";
PSEvent.REVERT = "1383494260";
PSEvent.RIPPLE = "1383099493";
PSEvent.ROTATE = "1383363685";
PSEvent.ROUGH_PASTELS = "1382508624";
PSEvent.SAVE = "1935767141";
PSEvent.SELECT = "1936483188";
PSEvent.SELECTIVE_COLOR = "1399612227";
PSEvent.SET = "1936028772";
PSEvent.SHARPEN_EDGES = "1399353925";
PSEvent.SHARPEN = "1399353968";
PSEvent.SHARPEN_MORE = "1399353933";
PSEvent.SHEAR = "1399353888";
PSEvent.SHOW = "1399355168";
PSEvent.SIMILAR = "1399680114";
PSEvent.SMART_BLUR = "1399681602";
PSEvent.SMOOTH = "1399682152";
PSEvent.SMUDGE_STICK = "1399678035";
PSEvent.SOLARIZE = "1399616122";
PSEvent.SPATTER = "1399878688";
PSEvent.SPHERIZE = "1399875698";
PSEvent.SPLIT_CHANNELS = "1399876675";
PSEvent.SPONGE = "1399877223";
PSEvent.SPRAYED_STROKES = "1399878227";
PSEvent.STAINED_GLASS = "1400139335";
PSEvent.STAMP = "1400139120";
PSEvent.STOP = "1400139632";
PSEvent.STROKE = "1400140395";
PSEvent.SUBTRACT = "1398961266";
PSEvent.SUBTRACT_FROM = "1398961222";
PSEvent.SUMIE = "1399679333";
PSEvent.TAKE_MERGED_SNAPSHOT = "1416318322";
PSEvent.TAKE_SNAPSHOT = "1416319854";
PSEvent.TEXTURE_FILL = "1417180230";
PSEvent.TEXTURIZER = "1417180282";
PSEvent.THRESHOLD = "1416131187";
PSEvent.TILES = "1416393504";
PSEvent.TORN_EDGES = "1416785477";
PSEvent.TRACE_CONTOUR = "1416782659";
PSEvent.TRANSFORM = "1416785510";
PSEvent.TRAP = "1416782192";
PSEvent.TWIRL = "1417114220";
PSEvent.UNDERPAINTING = "1433298034";
PSEvent.UNDO = "1970168943";
PSEvent.UNGROUP = "1433298802";
PSEvent.UNLINK = "1433300075";
PSEvent.UNSHARP_MASK = "1433301837";
PSEvent.VARIATIONS = "1450341486";
PSEvent.WAIT = "1466001780";
PSEvent.WATER_PAPER = "1467249232";
PSEvent.WATERCOLOR = "1467249251";
PSEvent.WAVE = "1466005093";
PSEvent.WIND = "1466852384";
PSEvent.ZIG_ZAG = "1516722791";
PSEvent.BACK_LIGHT = "1113678668";
PSEvent.FILL_FLASH = "1181314117";
PSEvent.COLOR_CAST = "1131375685";
PSEvent.OPEN_UNTITLED = "1332768341";

PSEvent.events = {
"1095988345":"APPLY_STYLE",
"1097032517":"ACCENTED_EDGES",
"1097092723":"ADD_NOISE",
"1097098272":"ADD",
"1097098324":"ADD_TO",
"1097623406":"ALIGN",
"1097624608":"ALL",
"1097754451":"ANGLED_STROKES",
"1097887817":"APPLY_IMAGE",
"1098084980":"ASSERT",
"1098281575":"AVERAGE",
"1113678668":"BACK_LIGHT",
"1114403360":"BLUR",
"1114403405":"BLUR_MORE",
"1114793074":"BORDER",
"1114793795":"BRIGHTNESS",
"1114853996":"BAS_RELIEF",
"1114923846":"BATCH_FROM_DROPLET",
"1114923880":"BATCH",
"1130916931":"CHALK_CHARCOAL",
"1130917453":"CHANNEL_MIXER",
"1130918499":"CHARCOAL",
"1130918509":"CHROME",
"1131177075":"CLOUDS",
"1131177330":"CLEAR",
"1131180610":"COLOR_BALANCE",
"1131180616":"COLOR_HALFTONE",
"1131180624":"COLORED_PENCIL",
"1131180626":"COLOR_RANGE",
"1131180832":"CLOSE",
"1131312195":"CONTE_CRAYON",
"1131312227":"CONTRACT",
"1131312717":"CONVERT_MODE",
"1131312723":"CANVAS_SIZE",
"1131375685":"COLOR_CAST",
"1131431512":"COPY_EFFECTS",
"1131435084":"COPY_TO_LAYER",
"1131444557":"COPY_MERGED",
"1131573104":"CROP",
"1131573612":"CRAQUELURE",
"1131574120":"CROSSHATCH",
"1131574132":"CRYSTALLIZE",
"1131574340":"CREATE_DROPLET",
"1131574899":"CURVES",
"1131639917":"CUSTOM",
"1131683872":"CUTOUT",
"1131697228":"CUT_TO_LAYER",
"1147563600":"DEFINE_PATTERN",
"1147564611":"DIFFERENCE_CLOUDS",
"1147564647":"DEFRINGE",
"1147564832":"DIFFUSE",
"1147564871":"DIFFUSE_GLOW",
"1147958304":"DELETE",
"1148089458":"DE_INTERLACE",
"1148218467":"DUPLICATE",
"1148346743":"DRAW",
"1148349267":"DARK_STROKES",
"1148352834":"DRY_BRUSH",
"1148415075":"DESELECT",
"1148416099":"DESPECKLE",
"1148416108":"DISPLACE",
"1148417107":"DUST_AND_SCRATCHES",
"1148417138":"DISTRIBUTE",
"1148417140":"DESATURATE",
"1164796531":"EMBOSS",
"1165061242":"EQUALIZE",
"1165517672":"EXCHANGE",
"1165521006":"EXPAND",
"1165521010":"EXPORT",
"1165522034":"EXTRUDE",
"1180787813":"FADE",
"1180856947":"FIBERS",
"1180922912":"FACET",
"1181314117":"FILL_FLASH",
"1181491232":"FILL",
"1181510000":"FLIP",
"1181510983":"FILM_GRAIN",
"1181512777":"FLATTEN_IMAGE",
"1181512818":"FILTER",
"1181639749":"FIND_EDGES",
"1181902701":"FRAGMENT",
"1181905763":"FRESCO",
"1182034034":"FEATHER",
"1198289696":"GLASS",
"1198290757":"GLOWING_EDGES",
"1198673264":"GRADIENT_MAP",
"1198678352":"GRAPHIC_PEN",
"1198679150":"GRADIENT",
"1198681632":"GRAIN",
"1198681975":"GROW",
"1198682188":"GROUP",
"1198747202":"GAUSSIAN_BLUR",
"1213428850":"HUE_SATURATION",
"1214521376":"HIDE",
"1214736464":"HIGH_PASS",
"1215063635":"HALFTONE_SCREEN",
"1215521360":"HSBHSL",
"1231906643":"IMAGE_SIZE",
"1231908978":"IMPORT",
"1231973199":"INK_OUTLINES",
"1231975511":"INTERSECT_WITH",
"1231975538":"INTERSECT",
"1231976050":"INVERT",
"1231976051":"INVERSE",
"1281845317":"LIGHTING_EFFECTS",
"1282304800":"LINK",
"1282306886":"LENS_FLARE",
"1282829427":"LEVELS",
"1297313908":"MERGE_SPOT_CHANNEL",
"1298427424":"MEDIAN",
"1298866208":"MAKE",
"1299082528":"MINIMUM",
"1299343154":"MERGE_LAYERS",
"1299343180":"MERGE_LAYERS_OLD",
"1299343190":"MERGE_VISIBLE",
"1299407648":"MOSAIC",
"1299407700":"MOSAIC_PLUGIN",
"1299476034":"MOTION_BLUR",
"1299737888":"MAXIMUM",
"1299870830":"MEZZOTINT",
"1313303671":"NEON_GLOW",
"1314149187":"NTSCCOLORS",
"1316245618":"NOTE_PAPER",
"1316251257":"NOTIFY",
"1316516896":"NEXT",
"1331916370":"OCEAN_RIPPLE",
"1332114292":"OFFSET",
"1332768288":"OPEN",
"1332768341":"OPEN_UNTITLED",
"1348552280":"PASTE_EFFECTS",
"1349022819":"PHOTOCOPY",
"1349280544":"PLACE",
"1349284384":"POLAR",
"1349284695":"PLASTIC_WRAP",
"1349284724":"PLASTER",
"1349284939":"PALETTE_KNIFE",
"1349286176":"PLAY",
"1349411688":"PINCH",
"1349415968":"PAINT",
"1349416004":"PAINT_DAUBS",
"1349416044":"POINTILLIZE",
"1349674580":"PROFILE_TO_PROFILE",
"1349674853":"PURGE",
"1349676660":"PRINT",
"1349678707":"PREVIOUS",
"1349743685":"POSTER_EDGES",
"1349743689":"PASTE_INTO",
"1349743695":"PASTE_OUTSIDE",
"1349743730":"POSTERIZE",
"1349804904":"PATCHWORK",
"1382313026":"RADIAL_BLUR",
"1382508624":"ROUGH_PASTELS",
"1382905410":"REMOVE_BLACK_MATTE",
"1382905420":"REMOVE_LAYER_MASK",
"1382905431":"REMOVE_WHITE_MATTE",
"1382968608":"RENAME",
"1383099459":"REPLACE_COLOR",
"1383099493":"RIPPLE",
"1383294324":"RESET",
"1383298132":"RASTERIZE_TYPE_SHEET",
"1383298162":"RASTERIZE",
"1383359340":"RETICULATION",
"1383363685":"ROTATE",
"1383494260":"REVERT",
"1398961222":"SUBTRACT_FROM",
"1398961266":"SUBTRACT",
"1399353888":"SHEAR",
"1399353925":"SHARPEN_EDGES",
"1399353933":"SHARPEN_MORE",
"1399353968":"SHARPEN",
"1399355168":"SHOW",
"1399612227":"SELECTIVE_COLOR",
"1399616122":"SOLARIZE",
"1399678035":"SMUDGE_STICK",
"1399679333":"SUMIE",
"1399680114":"SIMILAR",
"1399681602":"SMART_BLUR",
"1399682152":"SMOOTH",
"1399875698":"SPHERIZE",
"1399876675":"SPLIT_CHANNELS",
"1399877223":"SPONGE",
"1399878227":"SPRAYED_STROKES",
"1399878688":"SPATTER",
"1400139120":"STAMP",
"1400139335":"STAINED_GLASS",
"1400139632":"STOP",
"1400140395":"STROKE",
"1415861280":"_3DTRANSFORM",
"1416131187":"THRESHOLD",
"1416318322":"TAKE_MERGED_SNAPSHOT",
"1416319854":"TAKE_SNAPSHOT",
"1416393504":"TILES",
"1416782192":"TRAP",
"1416782659":"TRACE_CONTOUR",
"1416785477":"TORN_EDGES",
"1416785510":"TRANSFORM",
"1417114220":"TWIRL",
"1417180230":"TEXTURE_FILL",
"1417180282":"TEXTURIZER",
"1433298034":"UNDERPAINTING",
"1433298802":"UNGROUP",
"1433300075":"UNLINK",
"1433301837":"UNSHARP_MASK",
"1450341486":"VARIATIONS",
"1466001780":"WAIT",
"1466005093":"WAVE",
"1466852384":"WIND",
"1467249232":"WATER_PAPER",
"1467249251":"WATERCOLOR",
"1516722791":"ZIG_ZAG",
"1668247673":"COPY",
"1668641824":"CUT",
"1684825720":"DISABLE_LAYER_FX",
"1734702180":"GET",
"1836021349":"MOVE",
"1885434740":"PASTE",
"1903520116":"QUIT",
"1935767141":"SAVE",
"1936028772":"SET",
"1936483188":"SELECT",
"1970168943":"UNDO"
};

/**
 * PSEventAdapter provides APIs for registering and unregistering event 
 * listeners for Photoshop events. It requires the PSHostAdapter Photoshop 
 * plugin to be installed in the host application in order for its method
 * calls to have any effect.
 * 
 * Use the addEventListener and removeEventListener
 * methods to add and remove event listeners for Photoshop events. Specify
 * the unique code for a Photoshop event to the addEventListener
 * function to start listening for it.
 * 
 * Photoshop events are identified either by a "char ID" or a "string ID".
 * Char IDs statically map to a particular event code. String IDs map 
 * dynamically to a code which varies across Photoshop runtimes.
 * 
 * Listening for events defined by Char IDs
 * 
 * The PSEvent class provides a set of constants representing
 * the codes for events defined by char IDs. For example, to listen for the 
 * opening of a document in Photoshop, use:
 * 
 * PSEventAdapter.getInstance().addEventListener(PSEvent.OPEN, listener);
 * 
 * where listener is a method with the following signature:
 * 
 * function listener(event:PSEvent)
 * 
 * When a document is opened in Photoshop, a PSEvent 
 * instance with type PSEvent.OPEN will be dispatched.
 * 
 * Listening for events defined by String IDs
 * 
 * To listen for an event with a String ID, firstly obtain the event's
 * runtime code. This is possible using the app.stringIDToTypeID
 * method provided in the JavaScript scripting interface. For example: 
 * 
 * var code = app.stringIDToTypeID("some_event_name");
 * 
 * Then convert the code to a String and call 
 * addEventListener
 * 
 * PSEventAdapter.getInstance().addEventListener(code, listener);
 * 
 * Determining which events corresponds to which user interactions
 * 
 * To determine which events correspond to which user interactions, it is 
 * recommended to use the Photoshop ScriptListener plug-in. See the 
 * Product-specific guide for Photoshop provided with ExtensionBuilder for 
 * details on how to use the ScriptListener plug-in.
 *  
 */ 
function PSEventAdapter()
{
	EventAdapter.call(this, PSEventAdapter.NAMESPACE);	
}

/**
 * <p>Returns the PSEventAdapter instance.</p>
 * 
 * @return the PSEventAdapter instance
 */ 
PSEventAdapter.getInstance = function() {
	if (PSEventAdapter.instance == null)
		PSEventAdapter.instance = new PSEventAdapter();
	return PSEventAdapter.instance;
};

PSEventAdapter.NAMESPACE = "com.adobe.photoshop.events";

extendObj(PSEventAdapter, EventAdapter);

PSEventAdapter.prototype.createAppEvent = function(event) {
    var parser = new DOMParser();
    var xmlDoc  = parser.parseFromString(event.data.replace("<![CDATA[", "").replace("]]>", ""), "text/xml");
	var eventId = xmlDoc.firstChild.getAttribute("id");
    return new PSEvent(eventId);
};

function extendObj(childObj, parentObj) 
{
    var tmpObj = new Function();
    tmpObj.prototype = parentObj.prototype;
    childObj.prototype = new tmpObj();
    childObj.prototype.constructor = childObj;
};