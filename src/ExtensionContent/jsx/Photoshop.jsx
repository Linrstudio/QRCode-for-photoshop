$._ext_PHXS={
    run : function() {
    
    	/**********  Replace below sample code with your own JSX code  **********/
        var appName;	    
	    appName = "Hello Photoshop";	    
        alert(appName);
        /************************************************************************/
        
        return appName;
    },
    open : function(path, txt){
    	var fileRef = new File(path);
    	app.open(fileRef);
    	this.covert2shape(txt);
    },
    covert2shape: function(txt){
		// =======================================================
		var idMk = charIDToTypeID( "Mk  " );
		    var desc4 = new ActionDescriptor();
		    var idnull = charIDToTypeID( "null" );
		        var ref4 = new ActionReference();
		        var idannotation = stringIDToTypeID( "annotation" );
		        ref4.putClass( idannotation );
		    desc4.putReference( idnull, ref4 );
		    var idUsng = charIDToTypeID( "Usng" );
		        var desc5 = new ActionDescriptor();
		        var idLctn = charIDToTypeID( "Lctn" );
		            var desc6 = new ActionDescriptor();
		            var idHrzn = charIDToTypeID( "Hrzn" );
		            var idPxl = charIDToTypeID( "#Pxl" );
		            desc6.putUnitDouble( idHrzn, idPxl, -31.000000 );
		            var idVrtc = charIDToTypeID( "Vrtc" );
		            var idPxl = charIDToTypeID( "#Pxl" );
		            desc6.putUnitDouble( idVrtc, idPxl, -82.000000 );
		        var idPnt = charIDToTypeID( "Pnt " );
		        desc5.putObject( idLctn, idPnt, desc6 );
		        var idSz = charIDToTypeID( "Sz  " );
		            var desc7 = new ActionDescriptor();
		            var idHrzn = charIDToTypeID( "Hrzn" );
		            var idPxl = charIDToTypeID( "#Pxl" );
		            desc7.putUnitDouble( idHrzn, idPxl, 240.000000 );
		            var idVrtc = charIDToTypeID( "Vrtc" );
		            var idPxl = charIDToTypeID( "#Pxl" );
		            desc7.putUnitDouble( idVrtc, idPxl, 140.000000 );
		        var idOfst = charIDToTypeID( "Ofst" );
		        desc5.putObject( idSz, idOfst, desc7 );
		        var idannotType = stringIDToTypeID( "annotType" );
		        var idannotType = stringIDToTypeID( "annotType" );
		        var idannotText = stringIDToTypeID( "annotText" );
		        desc5.putEnumerated( idannotType, idannotType, idannotText );
		    var idannotation = stringIDToTypeID( "annotation" );
		    desc4.putObject( idUsng, idannotation, desc5 );
		executeAction( idMk, desc4, DialogModes.NO );
		
		// =======================================================
		var idsetd = charIDToTypeID( "setd" );
		    var desc8 = new ActionDescriptor();
		    var idnull = charIDToTypeID( "null" );
		        var ref5 = new ActionReference();
		        var idannotation = stringIDToTypeID( "annotation" );
		        ref5.putIndex( idannotation, 0 );
		    desc8.putReference( idnull, ref5 );
		    var idT = charIDToTypeID( "T   " );
		        var desc9 = new ActionDescriptor();
		        var idTxtD = charIDToTypeID( "TxtD" );
		        desc9.putData( idTxtD, String.fromCharCode( 255, 254, 115, 0, 115, 0, 115, 0 ) );
		        var idtext = stringIDToTypeID( "text" );
		        desc9.putString( idtext, txt);
		    var idannotation = stringIDToTypeID( "annotation" );
		    desc8.putObject( idT, idannotation, desc9 );
		executeAction( idsetd, desc8, DialogModes.NO );
    
    	// =======================================================
		var idslct = charIDToTypeID( "slct" );
		    var desc95 = new ActionDescriptor();
		    var idnull = charIDToTypeID( "null" );
		        var ref79 = new ActionReference();
		        var idmagicWandTool = stringIDToTypeID( "magicWandTool" );
		        ref79.putClass( idmagicWandTool );
		    desc95.putReference( idnull, ref79 );
		    var iddontRecord = stringIDToTypeID( "dontRecord" );
		    desc95.putBoolean( iddontRecord, true );
		    var idforceNotify = stringIDToTypeID( "forceNotify" );
		    desc95.putBoolean( idforceNotify, true );
		executeAction( idslct, desc95, DialogModes.NO );
		
		// =======================================================
		var idsetd = charIDToTypeID( "setd" );
		    var desc96 = new ActionDescriptor();
		    var idnull = charIDToTypeID( "null" );
		        var ref80 = new ActionReference();
		        var idChnl = charIDToTypeID( "Chnl" );
		        var idfsel = charIDToTypeID( "fsel" );
		        ref80.putProperty( idChnl, idfsel );
		    desc96.putReference( idnull, ref80 );
		    var idT = charIDToTypeID( "T   " );
		        var desc97 = new ActionDescriptor();
		        var idHrzn = charIDToTypeID( "Hrzn" );
		        var idPxl = charIDToTypeID( "#Pxl" );
		        desc97.putUnitDouble( idHrzn, idPxl, 6.000000 );
		        var idVrtc = charIDToTypeID( "Vrtc" );
		        var idPxl = charIDToTypeID( "#Pxl" );
		        desc97.putUnitDouble( idVrtc, idPxl, 1.000000 );
		    var idPnt = charIDToTypeID( "Pnt " );
		    desc96.putObject( idT, idPnt, desc97 );
		    var idTlrn = charIDToTypeID( "Tlrn" );
		    desc96.putInteger( idTlrn, 2 );
		executeAction( idsetd, desc96, DialogModes.NO );
		
		// =======================================================
		var idSmlr = charIDToTypeID( "Smlr" );
		    var desc98 = new ActionDescriptor();
		    var idnull = charIDToTypeID( "null" );
		        var ref81 = new ActionReference();
		        var idChnl = charIDToTypeID( "Chnl" );
		        var idfsel = charIDToTypeID( "fsel" );
		        ref81.putProperty( idChnl, idfsel );
		    desc98.putReference( idnull, ref81 );
		    var idTlrn = charIDToTypeID( "Tlrn" );
		    desc98.putInteger( idTlrn, 2 );
		executeAction( idSmlr, desc98, DialogModes.NO );
		
		// =======================================================
		var idMk = charIDToTypeID( "Mk  " );
		    var desc99 = new ActionDescriptor();
		    var idnull = charIDToTypeID( "null" );
		        var ref82 = new ActionReference();
		        var idLyr = charIDToTypeID( "Lyr " );
		        ref82.putClass( idLyr );
		    desc99.putReference( idnull, ref82 );
		executeAction( idMk, desc99, DialogModes.NO );
		
		// =======================================================
		var idMk = charIDToTypeID( "Mk  " );
		    var desc100 = new ActionDescriptor();
		    var idnull = charIDToTypeID( "null" );
		        var ref83 = new ActionReference();
		        var idPath = charIDToTypeID( "Path" );
		        ref83.putClass( idPath );
		    desc100.putReference( idnull, ref83 );
		    var idFrom = charIDToTypeID( "From" );
		        var ref84 = new ActionReference();
		        var idcsel = charIDToTypeID( "csel" );
		        var idfsel = charIDToTypeID( "fsel" );
		        ref84.putProperty( idcsel, idfsel );
		    desc100.putReference( idFrom, ref84 );
		    var idTlrn = charIDToTypeID( "Tlrn" );
		    var idPxl = charIDToTypeID( "#Pxl" );
		    desc100.putUnitDouble( idTlrn, idPxl, 0.500000 );
		executeAction( idMk, desc100, DialogModes.NO );
		
		// =======================================================
		var idslct = charIDToTypeID( "slct" );
		    var desc101 = new ActionDescriptor();
		    var idnull = charIDToTypeID( "null" );
		        var ref85 = new ActionReference();
		        var idpenTool = stringIDToTypeID( "penTool" );
		        ref85.putClass( idpenTool );
		    desc101.putReference( idnull, ref85 );
		    var iddontRecord = stringIDToTypeID( "dontRecord" );
		    desc101.putBoolean( iddontRecord, true );
		    var idforceNotify = stringIDToTypeID( "forceNotify" );
		    desc101.putBoolean( idforceNotify, true );
		executeAction( idslct, desc101, DialogModes.NO );
		
		// =======================================================
		var idMk = charIDToTypeID( "Mk  " );
		    var desc102 = new ActionDescriptor();
		    var idnull = charIDToTypeID( "null" );
		        var ref86 = new ActionReference();
		        var idcontentLayer = stringIDToTypeID( "contentLayer" );
		        ref86.putClass( idcontentLayer );
		    desc102.putReference( idnull, ref86 );
		    var idUsng = charIDToTypeID( "Usng" );
		        var desc103 = new ActionDescriptor();
		        var idType = charIDToTypeID( "Type" );
		            var desc104 = new ActionDescriptor();
		            var idClr = charIDToTypeID( "Clr " );
		                var desc105 = new ActionDescriptor();
		                var idRd = charIDToTypeID( "Rd  " );
		                desc105.putDouble( idRd, 0 );
		                var idGrn = charIDToTypeID( "Grn " );
		                desc105.putDouble( idGrn, 0 );
		                var idBl = charIDToTypeID( "Bl  " );
		                desc105.putDouble( idBl, 0 );
		            var idRGBC = charIDToTypeID( "RGBC" );
		            desc104.putObject( idClr, idRGBC, desc105 );
		        var idsolidColorLayer = stringIDToTypeID( "solidColorLayer" );
		        desc103.putObject( idType, idsolidColorLayer, desc104 );
		        var idShp = charIDToTypeID( "Shp " );
		            var desc106 = new ActionDescriptor();
		            var idTrgp = charIDToTypeID( "Trgp" );
		            var idPthK = charIDToTypeID( "PthK" );
		            var idTrgp = charIDToTypeID( "Trgp" );
		            desc106.putEnumerated( idTrgp, idPthK, idTrgp );
		        var idpathClass = stringIDToTypeID( "pathClass" );
		        desc103.putObject( idShp, idpathClass, desc106 );
		        var idstrokeStyle = stringIDToTypeID( "strokeStyle" );
		            var desc107 = new ActionDescriptor();
		            var idstrokeStyleVersion = stringIDToTypeID( "strokeStyleVersion" );
		            desc107.putInteger( idstrokeStyleVersion, 2 );
		            var idstrokeEnabled = stringIDToTypeID( "strokeEnabled" );
		            desc107.putBoolean( idstrokeEnabled, false );
		            var idfillEnabled = stringIDToTypeID( "fillEnabled" );
		            desc107.putBoolean( idfillEnabled, true );
		            var idstrokeStyleLineWidth = stringIDToTypeID( "strokeStyleLineWidth" );
		            var idPnt = charIDToTypeID( "#Pnt" );
		            desc107.putUnitDouble( idstrokeStyleLineWidth, idPnt, 3.000000 );
		            var idstrokeStyleLineDashOffset = stringIDToTypeID( "strokeStyleLineDashOffset" );
		            var idPnt = charIDToTypeID( "#Pnt" );
		            desc107.putUnitDouble( idstrokeStyleLineDashOffset, idPnt, 0.000000 );
		            var idstrokeStyleMiterLimit = stringIDToTypeID( "strokeStyleMiterLimit" );
		            desc107.putDouble( idstrokeStyleMiterLimit, 100.000000 );
		            var idstrokeStyleLineCapType = stringIDToTypeID( "strokeStyleLineCapType" );
		            var idstrokeStyleLineCapType = stringIDToTypeID( "strokeStyleLineCapType" );
		            var idstrokeStyleButtCap = stringIDToTypeID( "strokeStyleButtCap" );
		            desc107.putEnumerated( idstrokeStyleLineCapType, idstrokeStyleLineCapType, idstrokeStyleButtCap );
		            var idstrokeStyleLineJoinType = stringIDToTypeID( "strokeStyleLineJoinType" );
		            var idstrokeStyleLineJoinType = stringIDToTypeID( "strokeStyleLineJoinType" );
		            var idstrokeStyleMiterJoin = stringIDToTypeID( "strokeStyleMiterJoin" );
		            desc107.putEnumerated( idstrokeStyleLineJoinType, idstrokeStyleLineJoinType, idstrokeStyleMiterJoin );
		            var idstrokeStyleLineAlignment = stringIDToTypeID( "strokeStyleLineAlignment" );
		            var idstrokeStyleLineAlignment = stringIDToTypeID( "strokeStyleLineAlignment" );
		            var idstrokeStyleAlignInside = stringIDToTypeID( "strokeStyleAlignInside" );
		            desc107.putEnumerated( idstrokeStyleLineAlignment, idstrokeStyleLineAlignment, idstrokeStyleAlignInside );
		            var idstrokeStyleScaleLock = stringIDToTypeID( "strokeStyleScaleLock" );
		            desc107.putBoolean( idstrokeStyleScaleLock, false );
		            var idstrokeStyleStrokeAdjust = stringIDToTypeID( "strokeStyleStrokeAdjust" );
		            desc107.putBoolean( idstrokeStyleStrokeAdjust, false );
		            var idstrokeStyleLineDashSet = stringIDToTypeID( "strokeStyleLineDashSet" );
		                var list12 = new ActionList();
		            desc107.putList( idstrokeStyleLineDashSet, list12 );
		            var idstrokeStyleBlendMode = stringIDToTypeID( "strokeStyleBlendMode" );
		            var idBlnM = charIDToTypeID( "BlnM" );
		            var idNrml = charIDToTypeID( "Nrml" );
		            desc107.putEnumerated( idstrokeStyleBlendMode, idBlnM, idNrml );
		            var idstrokeStyleOpacity = stringIDToTypeID( "strokeStyleOpacity" );
		            var idPrc = charIDToTypeID( "#Prc" );
		            desc107.putUnitDouble( idstrokeStyleOpacity, idPrc, 100.000000 );
		            var idstrokeStyleContent = stringIDToTypeID( "strokeStyleContent" );
		                var desc108 = new ActionDescriptor();
		                var idClr = charIDToTypeID( "Clr " );
		                    var desc109 = new ActionDescriptor();
		                    var idRd = charIDToTypeID( "Rd  " );
		                    desc109.putDouble( idRd, 255.000000 );
		                    var idGrn = charIDToTypeID( "Grn " );
		                    desc109.putDouble( idGrn, 0.000000 );
		                    var idBl = charIDToTypeID( "Bl  " );
		                    desc109.putDouble( idBl, 0.000000 );
		                var idRGBC = charIDToTypeID( "RGBC" );
		                desc108.putObject( idClr, idRGBC, desc109 );
		            var idsolidColorLayer = stringIDToTypeID( "solidColorLayer" );
		            desc107.putObject( idstrokeStyleContent, idsolidColorLayer, desc108 );
		            var idstrokeStyleResolution = stringIDToTypeID( "strokeStyleResolution" );
		            desc107.putDouble( idstrokeStyleResolution, 72.000000 );
		        var idstrokeStyle = stringIDToTypeID( "strokeStyle" );
		        desc103.putObject( idstrokeStyle, idstrokeStyle, desc107 );
		    var idcontentLayer = stringIDToTypeID( "contentLayer" );
		    desc102.putObject( idUsng, idcontentLayer, desc103 );
		executeAction( idMk, desc102, DialogModes.NO );
		
		// =======================================================
		var idCnvS = charIDToTypeID( "CnvS" );
		    var desc111 = new ActionDescriptor();
		    var idRltv = charIDToTypeID( "Rltv" );
		    desc111.putBoolean( idRltv, true );
		    var idWdth = charIDToTypeID( "Wdth" );
		    var idPxl = charIDToTypeID( "#Pxl" );
		    desc111.putUnitDouble( idWdth, idPxl, 40.000000 );
		    var idHght = charIDToTypeID( "Hght" );
		    var idPxl = charIDToTypeID( "#Pxl" );
		    desc111.putUnitDouble( idHght, idPxl, 40.000000 );
		    var idHrzn = charIDToTypeID( "Hrzn" );
		    var idHrzL = charIDToTypeID( "HrzL" );
		    var idCntr = charIDToTypeID( "Cntr" );
		    desc111.putEnumerated( idHrzn, idHrzL, idCntr );
		    var idVrtc = charIDToTypeID( "Vrtc" );
		    var idVrtL = charIDToTypeID( "VrtL" );
		    var idCntr = charIDToTypeID( "Cntr" );
		    desc111.putEnumerated( idVrtc, idVrtL, idCntr );
		executeAction( idCnvS, desc111, DialogModes.NO );
		
		// =======================================================
		var idShw = charIDToTypeID( "Shw " );
		    var desc2 = new ActionDescriptor();
		    var idnull = charIDToTypeID( "null" );
		        var list1 = new ActionList();
		            var ref2 = new ActionReference();
		            var idLyr = charIDToTypeID( "Lyr " );
		            var idOrdn = charIDToTypeID( "Ordn" );
		            var idTrgt = charIDToTypeID( "Trgt" );
		            ref2.putEnumerated( idLyr, idOrdn, idTrgt );
		        list1.putReference( ref2 );
		    desc2.putList( idnull, list1 );
		    var idTglO = charIDToTypeID( "TglO" );
		    desc2.putBoolean( idTglO, true );
		executeAction( idShw, desc2, DialogModes.NO );

		// =======================================================
		var idDslc = charIDToTypeID( "Dslc" );
		    var desc6 = new ActionDescriptor();
		    var idnull = charIDToTypeID( "null" );
		        var ref6 = new ActionReference();
		        var idPath = charIDToTypeID( "Path" );
		        var idOrdn = charIDToTypeID( "Ordn" );
		        var idTrgt = charIDToTypeID( "Trgt" );
		        ref6.putEnumerated( idPath, idOrdn, idTrgt );
		    desc6.putReference( idnull, ref6 );
		executeAction( idDslc, desc6, DialogModes.NO );


		// =======================================================
		var idslct = charIDToTypeID( "slct" );
		    var desc1 = new ActionDescriptor();
		    var idnull = charIDToTypeID( "null" );
		        var ref1 = new ActionReference();
		        var idmoveTool = stringIDToTypeID( "moveTool" );
		        ref1.putClass( idmoveTool );
		    desc1.putReference( idnull, ref1 );
		    var iddontRecord = stringIDToTypeID( "dontRecord" );
		    desc1.putBoolean( iddontRecord, true );
		    var idforceNotify = stringIDToTypeID( "forceNotify" );
		    desc1.putBoolean( idforceNotify, true );
		executeAction( idslct, desc1, DialogModes.NO );

    }
};