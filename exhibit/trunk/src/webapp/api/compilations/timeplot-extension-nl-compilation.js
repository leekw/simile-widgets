﻿

/* compile-prolog.js */
window.Exhibit_TimeplotExtension_isCompiled=true;


/* timeplot-extension.js */
(function(){var G=("Exhibit_TimeplotExtension_isCompiled" in window)&&window.Exhibit_TimeplotExtension_isCompiled;
Exhibit.TimeplotExtension={params:{bundle:true}};
var H=["timeplot-view.js"];
var B=["timeplot-view.css"];
var F={bundle:Boolean};
if(typeof Exhibit_TimeplotExtension_urlPrefix=="string"){Exhibit.TimeplotExtension.urlPrefix=Exhibit_TimeplotExtension_urlPrefix;
if("Exhibit_TimeplotExtension_parameters" in window){SimileAjax.parseURLParameters(Exhibit_TimeplotExtension_parameters,Exhibit.TimeplotExtension.params,F);
}}else{var D=SimileAjax.findScript(document,"/timeplot-extension.js");
if(D==null){SimileAjax.Debug.exception(new Error("Failed to derive URL prefix for Simile Exhibit Timeplot Extension code files"));
return ;
}Exhibit.TimeplotExtension.urlPrefix=D.substr(0,D.indexOf("timeplot-extension.js"));
SimileAjax.parseURLParameters(D,Exhibit.TimeplotExtension.params,F);
}var A=["http://api.simile-widgets.org/timeplot/1.1/timeplot-api.js"];
var C=[];
if(Exhibit.TimeplotExtension.params.bundle){A.push(Exhibit.TimeplotExtension.urlPrefix+"timeplot-extension-bundle.js");
C.push(Exhibit.TimeplotExtension.urlPrefix+"timeplot-extension-bundle.css");
}else{SimileAjax.prefixURLs(A,Exhibit.TimeplotExtension.urlPrefix+"scripts/",H);
SimileAjax.prefixURLs(C,Exhibit.TimeplotExtension.urlPrefix+"styles/",B);
}for(var E=0;
E<Exhibit.locales.length;
E++){A.push(Exhibit.TimeplotExtension.urlPrefix+"locales/"+Exhibit.locales[E]+"/timeplot-locale.js");
}if(!G){SimileAjax.includeJavascriptFiles(document,"",A);
SimileAjax.includeCssFiles(document,"",C);
}})();


/* timeplot-extension-bundle.js */
Exhibit.TimeplotView=function(E,F){this._div=E;
this._uiContext=F;
this._settings={};
this._accessors={getLabel:function(A,B,C){C(B.getObject(A,"label"));
},getProxy:function(A,B,C){C(A);
},getColorKey:null};
this._legend=[];
this._largestSize=0;
var D=this;
this._listener={onItemsChanged:function(){D._reconstruct();
}};
F.getCollection().addListener(this._listener);
};
Exhibit.TimeplotView._settingSpecs={"timeplotConstructor":{type:"function",defaultValue:null},"timeGeometry":{type:"function",defaultValue:null},"valueGeometry":{type:"function",defaultValue:null},"timeplotHeight":{type:"int",defaultValue:400},"gridColor":{type:"text",defaultValue:"#000000"},"colorCoder":{type:"text",defaultValue:null},"showHeader":{type:"boolean",defaultValue:true},"showSummary":{type:"boolean",defaultValue:true},"showFooter":{type:"boolean",defaultValue:true}};
Exhibit.TimeplotView._accessorSpecs=[{accessorName:"getProxy",attributeName:"proxy"},{accessorName:"getTime",attributeName:"pointTime",type:"date"},{accessorName:"getValue",attributeName:"pointValue",type:"float"},{accessorName:"getSeriesConnector",attributeName:"seriesConnector",type:"text"},{accessorName:"getSeriesTime",attributeName:"seriesTime",type:"text"},{accessorName:"getSeriesValue",attributeName:"seriesValue",type:"text"},{accessorName:"getColorKey",attributeName:"colorKey",type:"text"},{accessorName:"getEventLabel",attributeName:"eventLabel",type:"text"}];
Exhibit.TimeplotView.create=function(F,G,H){var E=new Exhibit.TimeplotView(G,Exhibit.UIContext.create(F,H));
Exhibit.TimeplotView._configure(E,F);
E._internalValidate();
E._initializeUI();
return E;
};
Exhibit.TimeplotView.createFromDOM=function(H,I,J){var G=Exhibit.getConfigurationFromDOM(H);
var F=new Exhibit.TimeplotView(I!=null?I:H,Exhibit.UIContext.createFromDOM(H,J));
Exhibit.SettingsUtilities.createAccessorsFromDOM(H,Exhibit.TimeplotView._accessorSpecs,F._accessors);
Exhibit.SettingsUtilities.collectSettingsFromDOM(H,Exhibit.TimeplotView._settingSpecs,F._settings);
Exhibit.TimeplotView._configure(F,G);
F._internalValidate();
F._initializeUI();
return F;
};
Exhibit.TimeplotView._configure=function(D,E){Exhibit.SettingsUtilities.createAccessors(E,Exhibit.TimeplotView._accessorSpecs,D._accessors);
Exhibit.SettingsUtilities.collectSettings(E,Exhibit.TimeplotView._settingSpecs,D._settings);
var F=D._accessors;
D._getTime=function(A,B,C){F.getProxy(A,B,function(H){F.getTime(H,B,C);
});
};
};
Exhibit.TimeplotView.prototype.dispose=function(){this._uiContext.getCollection().removeListener(this._listener);
this._timeplot=null;
this._toolboxWidget.dispose();
this._toolboxWidget=null;
this._dom.dispose();
this._dom=null;
this._div.innerHTML="";
this._div=null;
this._uiContext.dispose();
this._uiContext=null;
};
Exhibit.TimeplotView.prototype._internalValidate=function(){if("getColorKey" in this._accessors){if("colorCoder" in this._settings){this._colorCoder=this._uiContext.getExhibit().getComponent(this._settings.colorCoder);
}if(this._colorCoder==null){this._colorCoder=new Exhibit.DefaultColorCoder(this._uiContext);
}}};
Exhibit.TimeplotView.prototype._initializeUI=function(){var C=this;
var D={};
D.colorGradient=(this._colorCoder!=null&&"_gradientPoints" in this._colorCoder);
this._div.innerHTML="";
this._dom=Exhibit.ViewUtilities.constructPlottingViewDom(this._div,this._uiContext,this._settings.showSummary&&this._settings.showHeader,{onResize:function(){C._timeplot.repaint();
}},D);
this._toolboxWidget=Exhibit.ToolboxWidget.createFromDOM(this._div,this._div,this._uiContext);
this._eventSources=[];
this._eventSource=new Timeplot.DefaultEventSource();
this._columnSources=[];
this._reconstruct();
};
Exhibit.TimeplotView.prototype._reconstructTimeplot=function(U){var R=this._settings;
if(this._timeplot!=null){this._timeplot.dispose();
this._timeplot=null;
}if(U){this._eventSource.addMany(U);
}var V=this._dom.plotContainer;
if(R.timeplotConstructor!=null){this._timeplot=R.timeplotConstructor(V,this._eventSource);
}else{V.style.height=R.timeplotHeight+"px";
V.className="exhibit-timeplotView-timeplot";
V.id="timeplot-"+Math.floor(Math.random()*1000);
var e=(this._accessors.getColorKey!=null);
var T={mixed:false,missing:false,others:false,keys:new Exhibit.Set()};
var Y=new Timeplot.Color(R.gridColor);
var c=R.timeGeometry(Y);
var a=R.valueGeometry(Y);
var S=[];
for(var b=0;
b<this._legend.length;
b++){var f=null;
if(e){var Z=new Exhibit.Set();
Z.add(this._legend[b]);
f=this._colorCoder.translateSet(Z,T);
}this._columnSources.push(new Timeplot.ColumnSource(this._eventSource,b+1));
S.push(Timeplot.createPlotInfo({id:this._legend[b],dataSource:this._columnSources[b],timeGeometry:c,valueGeometry:a,lineColor:new Timeplot.Color(f),dotColor:new Timeplot.Color(f),showValues:true,roundValues:false}));
}this._timeplot=Timeplot.create(V,S);
setTimeout(this._timeplot.paint,100);
if(e){var d=this._dom.legendWidget;
var g=this._colorCoder;
var W=T.keys.toArray().sort();
if(this._colorCoder._gradientPoints!=null){d.addGradient(this._colorCoder._gradientPoints);
}else{for(var h=0;
h<W.length;
h++){var X=W[h];
var f=g.translate(X);
d.addEntry(f,X);
}}if(T.others){d.addEntry(g.getOthersColor(),g.getOthersLabel());
}if(T.mixed){d.addEntry(g.getMixedColor(),g.getMixedLabel());
}if(T.missing){d.addEntry(g.getMissingColor(),g.getMissingLabel());
}}}};
Exhibit.TimeplotView.prototype._reconstruct=function(){var h=this;
var i=this._uiContext.getCollection();
var k=this._uiContext.getDatabase();
var a=this._settings;
var Z=this._accessors;
var t=i.countRestrictedItems();
var g=[];
this._dom.legendWidget.clear();
for(var d=0;
d<this._columnSources.length;
d++){this._columnSources[d].dispose();
}this._columnSources=[];
this._eventSource.clear();
this._eventSource=new Timeplot.DefaultEventSource();
if(t>0){var q=i.getRestrictedItems();
var u=[];
var b={};
var o=new SimileAjax.Set([]);
var l=new SimileAjax.Set([]);
var v=function(B){var F;
Z.getSeriesTime(B,k,function(K){F=K;
return true;
});
var A;
Z.getSeriesValue(B,k,function(K){A=K;
return true;
});
var J;
Z.getLabel(B,k,function(K){J=K;
return true;
});
var C=F.split(";");
var G=A.split(";");
if(C.length!=G.length){throw"Exhibit-Timeplot Exception: time and value arrays of unequal size, unplottable";
}for(var I=0;
I<C.length;
I++){var D,E;
try{D=SimileAjax.DateTime.parseIso8601DateTime(C[I]).getTime();
}catch(H){throw"Exhibit-Timeplot Exception: cannot parse time";
}try{var E=parseFloat(G[I]);
}catch(H){throw"Exhibit-Timeplot Exception: cannot parse value";
}o.add(D);
if(!b[D]){b[D]={};
b[D][J]=E;
}else{b[D][J]=E;
}}l.add(J);
};
var f=function(E,A){var B;
Z.getValue(E,k,function(F){B=F;
return true;
});
var C;
Z.getSeriesConnector(E,k,function(F){C=F;
return true;
});
var D=A.getTime();
o.add(D);
if(!b[D]){b[D]={};
b[D][C]=B;
}else{b[D][C]=B;
}l.add(C);
};
q.visit(function(A){var B;
h._getTime(A,k,function(D){B=D;
return true;
});
if(B){f(A,B);
}else{try{v(A);
}catch(C){g.push(A);
}}});
var c=l.toArray();
var r=o.toArray();
this._legend=c;
r.sort(function(A,B){return A-B;
});
var m={};
for(var d=0;
d<r.length;
d++){var p=[];
for(var e=0;
e<c.length;
e++){var Y=b[r[d]][c[e]];
if(Y){p.push(parseFloat(Y));
m[c[e]]=Y;
}else{if(m[c[e]]){p.push(parseFloat(m[c[e]]));
}else{p.push(0);
}}}var s=SimileAjax.NativeDateUnit.fromNumber(parseInt(r[d]));
var j=new Timeplot.DefaultEventSource.NumericEvent(s,p);
u.push(j);
}var n=t-g.length;
if(n>this._largestSize){this._largestSize=n;
this._reconstructTimeplot();
this._eventSource.addMany(u);
}else{this._reconstructTimeplot();
this._eventSource.addMany(u);
}}this._dom.setUnplottableMessage(t,g);
};


/* timeplot-locale.js */
if(!("l10n" in Exhibit.TimeplotView)){Exhibit.TimeplotView.l10n={};
}Exhibit.TimeplotView.l10n.viewLabel="Grafiek";
Exhibit.TimeplotView.l10n.viewTooltip="Bekijk items op een grafiek";


/* compile-epilog.js */
(function(){var f=null;
if("SimileWidgets_onLoad" in window){if(typeof SimileWidgets_onLoad=="string"){f=eval(SimileWidgets_onLoad);
SimileWidgets_onLoad=null;
}else{if(typeof SimileWidgets_onLoad=="function"){f=SimileWidgets_onLoad;
SimileWidgets_onLoad=null;
}}}if(f!=null){f();
}})();