function TimePlay(options)	{
	var timePlay = this;
	timePlay.default_option = {
		container: '.timePlay',
		changeStartFuc:function(timePlay){},
		changeCurFuc:function(timePlay){}
	};
	timePlay.options   = jQuery.extend(true, timePlay.default_option, options);//基本配置
	timePlay.initDoms();//初始化结构 138行代码
	timePlay.timer     = null;//动画定时器
	timePlay.init      = 0;
	timePlay.dis       = 5;
	timePlay.startTime = null;
	timePlay.endTime   = null;
	timePlay.curTime   = null;
	timePlay.fillDate();
	timePlay.initPlay();//初始化
}

TimePlay.prototype.initPlay = function(){
	var timePlay = this;
	$('.playBtn').on('click',function(){//时间轴播放暂停   256行代码处
		if($(".playBtn").attr("data-v")=="1"){
			timePlay.play();
		}else{
			timePlay.stop();		
		}
	});
	
	$('.progress').on('mouseout',function(){
		$(".showTime").hide();
	})
	$(".progress").mousemove(function(event){
		timePlay.popHover(event);
	});
	$('.progress').on('click',function(event){
		timePlay.clickPopup(event);//93行代码
	})
	$(".back_hour").on('click',function(){
		timePlay.changeHour(-1)
	});
	$(".back_day").on('click',function(){
		timePlay.changeHour(-24);
	});
	$(".forward_hour").on('click',function(){
		timePlay.changeHour(1);
	});
	
	$(".now_time").on('click',function(){
		timePlay.backNow();
	});
	
	$(".forward_day").on('click',function(){
		timePlay.changeHour(24);
	});
}
TimePlay.prototype.backNow = function(){
	var timePlay = this;
	if($(".playBtn").attr("data-v")=="2")
		timePlay.stop();
	timePlay.fillDate();
	now = new Date();
	timePlay.init = now.getHours()*timePlay.dis;
	timePlay.curTime = now;
	timePlay.options.changeCurFuc(timePlay);
	if(now<timePlay.startTime||now>=timePlay.endTime){
		timePlay.startTime = new Date(now.getFullYear(),now.getMonth(),now.getDate());
		timePlay.fillDate();
	}
	$(".progessbar").animate({
			width:timePlay.init+""
	});
}

TimePlay.prototype.changeHour = function(tempTime){
	var timePlay = this;
	if($(".playBtn").attr("data-v")=="2")
		timePlay.stop();
	timePlay.curTime.setHours(timePlay.curTime.getHours()+tempTime);
	timePlay.options.changeCurFuc(timePlay);
	if(timePlay.curTime<timePlay.startTime||timePlay.curTime>=timePlay.endTime){
		start = new Date(timePlay.curTime.getFullYear(),timePlay.curTime.getMonth(),timePlay.curTime.getDate());
		timePlay.startTime = start;
		timePlay.fillDate();
		timePlay.init = timePlay.curTime.getHours()*timePlay.dis;
	}else{
		timePlay.init = timePlay.init+timePlay.dis*tempTime;
	}
	$(".progessbar").animate({
			width:timePlay.init+""
	});
}

TimePlay.prototype.clickPopup = function(event){
	var timePlay = this;
	var div = $(".progress");
	event = event||window.event;
	var pagex=parseInt(event.clientX-div.offset().left);
	timePlay.init = parseInt(pagex/timePlay.dis)*timePlay.dis;
	$(".progessbar").animate({
			width:timePlay.init+""
	});
	now = new Date(timePlay.startTime.getFullYear(),timePlay.startTime.getMonth(),timePlay.startTime.getDate());
	now.setHours(parseInt(pagex/timePlay.dis));
	timePlay.curTime = now;
}

TimePlay.prototype.play = function(){
	var timePlay = this;
	if(timePlay.curTime==null){
		timePlay.curTime = new Date(timePlay.startTime.getFullYear(),timePlay.startTime.getMonth(),timePlay.startTime.getDate());
	}
	deg = 0;
	var playStart= setInterval(function(){
		if(deg>=360){
			$(".playBtn").css("background-image","url(image/play.png)");
			$(".playBtn").attr("data-v","2");
			timePlay.timer = setInterval(function(){
						if(timePlay.init>=720){
						  timePlay.init=0;
						  timePlay.startTime=new Date(timePlay.curTime.getFullYear(),timePlay.curTime.getMonth(),timePlay.curTime.getDate());
						  timePlay.fillDate();
						}
						timePlay.init=parseInt(timePlay.init)+timePlay.dis;
						$(".progessbar").animate({
							width:timePlay.init+""
						});
						timePlay.curTime.setHours(timePlay.curTime.getHours()+1);
						timePlay.options.changeCurFuc(timePlay);
					},1000);
		clearInterval(playStart);
			return;
		}
		$(".playBtn").css("transform","rotate("+deg+"deg)");
		$(".playBtn").css("-moz-transform","rotate("+deg+"deg)");
		$(".playBtn").css("-webkit-transform","rotate("+deg+"deg)");
		deg+=2;
	},1);
}
TimePlay.prototype.stop = function(){
	var timePlay = this;
	deg = 0;
	var playStart= setInterval(function(){
		if(deg>=360){
			$(".playBtn").css("background-image","url(image/stop.png)");
			$(".playBtn").attr("data-v","1");
			clearInterval(timePlay.timer);
			clearInterval(playStart);
			return;
		}
		$(".playBtn").css("transform","rotate("+deg+"deg)");
		$(".playBtn").css("-moz-transform","rotate("+deg+"deg)");
		$(".playBtn").css("-webkit-transform","rotate("+deg+"deg)");
		deg+=2;
	},1);
}	

TimePlay.prototype.popHover = function(event){
	var timePlay = this;
	var div = $(".progress");
	event = event||window.event;
	var pagex=parseInt(event.clientX-div.offset().left);
	$(".showTime").show();
	$(".showTime").css("left",parseInt(event.clientX-61)+"px");
	var startTime_temp = $(timePlay.options.container+" table").eq(0).children("tbody").children("tr").children("td").eq(0).text();
	var startTime = new Date(startTime_temp.split("-")[0],startTime_temp.split("-")[1]-1,startTime_temp.split("-")[2]);
	var dayTemp = parseInt(pagex/5/24);
	var hourTemp = parseInt(pagex/5)%24; 
	if(hourTemp<=9)
		hourTemp="0"+hourTemp;
	$(".showTime").text(timePlay.addTime(startTime,dayTemp)+" "+hourTemp+"时");
}

TimePlay.prototype.initDoms = function(){//初始化dom 
	var timePlay = this;
	$(timePlay.options.container).empty();
	var playBtn = '<div class="playBtn_box"><div class="playBtn" data-v="1"></div></div>';
	var playBar = '<div class="playBar_box">'+
							'<div class="showTime">2018-12-24 20时</div>'+
							'<div class="progress" style="width:100%;height:8px;border:1px solid #fff;border-radius:4px;margin-top:24px;">'+
								'<div class="progessbar" style="width:0px;height:100%;background-color:#fff;float:left;"></div>'+
							'</div>'+
							'<table>'+
								'<tr>'+
									'<td>2018-12-18</td>'+
									'<td>2018-12-19</td>'+
									'<td>2018-12-20</td>'+
									'<td>2018-12-21</td>'+
									'<td>2018-12-22</td>'+
									'<td>2018-12-23</td>'+
								'</tr>'+
							'</table>'+
						'</div>';
	var playCtr = '<div class="playCtr_box">'+
							'<div class="ctr_div" style="margin-left:7px;">'+
								'<div class="back_hour">-1h</div>'+
								'<div class="back_day">-24h</div>'+
							'</div>'+
							'<div class="ctr_div">'+
								'<div class="now_time">现在</div>'+
							'</div>'+
							'<div class="ctr_div">'+
								'<div class="forward_hour">+1h</div>'+
								'<div class="forward_day">+24h</div>'+
							'</div>'+
						'</div>';
	$(timePlay.options.container).append(playBtn).append(playBar).append(playCtr);
}

TimePlay.prototype.fillDate = function(){
		var timePlay =this;
		now = new Date();
		if(timePlay.startTime==null){
			timePlay.startTime = new Date(now.getFullYear(),now.getMonth(),now.getDate());
			timePlay.curTime = new Date(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours());
			timePlay.init = timePlay.curTime.getHours()*timePlay.dis;
			$(".progessbar").animate({
							width:timePlay.init+""
			});
		}else{
			now = new Date(timePlay.startTime.getFullYear(),timePlay.startTime.getMonth(),timePlay.startTime.getDate());
		}
		now.setHours(0);
		for(i=0;i<6;i++){
			var time = now.getFullYear()+"-"+((now.getMonth()+1)<=9?"0"+parseInt(now.getMonth()+1):parseInt(now.getMonth()+1))+"-"+(now.getDate()<=9?"0"+now.getDate():now.getDate());
			$(timePlay.options.container+" table").each(
				function(){
					$(this).children("tbody").children("tr").children("td").eq(i).text(time)
				}
			);
			now.setDate(now.getDate()+1);
		}
		now.setHours(0);
		timePlay.endTime = now;
		timePlay.options.changeStartFuc(timePlay);
		timePlay.options.changeCurFuc(timePlay);
}

TimePlay.prototype.addTime = function(startTime,tempdate){
		startTime.setDate(startTime.getDate()+tempdate);
		year = startTime.getFullYear();
		month = startTime.getMonth()+1;
		date = startTime.getDate();
		return year+"-"+(month<=9?"0"+month:month)+"-"+(date<=9?"0"+date:date);
}


