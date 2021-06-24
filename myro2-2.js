"use strict";

$(document).ready(function () {
  startTravelDate = new Date();
  travelDay = 1;
  $("#travelDay").val(travelDay);
  setEndTravelDateAfterSettingStartDateAndSetEDailyTimeSettingArea(startTravelDate);
  setDailyTimeSettingArea(startTravelDate, endTravelDate);
  changeSelectedHotelAreaWhenChangeDate();
  var menuactive = false;
  $("#smartnav").click(function () {
    //console.log(menuactive);
    if (menuactive) {
      $("#menu").animate({
        left: '-200'
      });
      menuactive = false;
    } else {
      $("#menu").animate({
        left: 0
      });
      menuactive = true;
    }
  });
  var l = location.href;

  if (l.split("?")[1].split("&")[1]) {
    var ll = l.split("?")[1].split("&")[1];

    if (ll.split("=")[0] == "savedRouteToken") {
      savedRouteToken = ll.split("=")[1];
      addUserTrackingData('savedRouteToken:' + savedRouteToken); // socket = io(headAddress);
      //
      // socket.emit('joinRoom', savedRouteToken);
      //
      // socket.on('changeHotelDepartTime', function (params) {
      // 	changeHotelDepartTime(params.i, params.value, true);
      // });
      //
      // socket.on('changeSpotStayingH', function (params) {
      // 	changeSpotStayingH(params.spot, params.i, params.j, params.value, true);
      // });
      //
      // socket.on('changeSpotStayingM', function (params) {
      // 	changeSpotStayingM(params.spot, params.i, params.j, params.value, true);
      // });
      //
      // socket.on('deleteSpotFromPlan', function (params) {
      // 	deleteSpotFromPlan(params.spot, params.i, params.j, true);
      // });
      //
      // socket.on('moveSpotToOtherDay', function (params) {
      // 	moveSpotToOtherDay(params.from, params.fromIdx, params.to, params.toIdx, true);
      // });
      //
      // socket.on('moveSpotInSameDay', function (params) {
      // 	moveSpotInSameDay(params.dayIdx, params.toIdx, params.fromIdx, true);
      // });
      //
      // socket.on('remakeRoute', function (params) {
      // 	remakeRoute(true);
      // });
      //
      // socket.on('restoreRoute', function (params) {
      // 	restoreRoute(true);
      // });
      //
      // socket.on('editWarning', function (params) {
      // 	showToastMsg("현재 2명 이상의 사용자가 이 일정을 수정중입니다. 이미 계획을 수정한 후에 다른 사용자가 접속할 시에는 다른 사용자와의 일정이 일치하지 않게 됩니다. 일정 확정을 누른 후에 다른 사용자가 접속하거나, 혹은 모든 사용자가 새로고침 후에 처음 상태에서 일정을 수정해주세요", 20);
      // });

      showLoading();
      $.ajax({
        type: 'GET',
        url: headAddress + '/getDataFromSavedRoute',
        data: {
          savedRouteToken: savedRouteToken
        },
        success: function success(data) {
          var gestureHandlingType = 'cooperative';

          if ($(window).width() > 600) {
            gestureHandlingType = '';
          }

          document.getElementById('routepage').style.display = 'block';
          map2 = new google.maps.Map(document.getElementById('googleMapForRoute'), {
            zoom: 11,
            center: {
              lat: startLat,
              lng: startLng
            },
            gestureHandling: gestureHandlingType
          });
          dataFromServer = data;
          backupDataFromServer = JSON.parse(JSON.stringify(dataFromServer)); // 공항, 이메일 정보 등

          backupDataFromSavedToken = JSON.parse(JSON.stringify(dataFromServer));
          delete backupDataFromSavedToken.spotsByDay;
          delete backupDataFromSavedToken.stayingInfos;
          delete backupDataFromSavedToken.originalSchedule;

          for (var i = 0; i < dataFromServer.spotsByDay.length; i++) {
            var spots = dataFromServer.spotsByDay[i];

            for (var j = 1; j < spots.length; j++) {
              var spot = spots[j];
              addSpotToSelectedSpotsWhenHaveToken(spot);
            }
          }

          startTravelDate = new Date(dataFromServer.startTravelDate);
          travelDay = dataFromServer.spotsByDay.length - 1;
          setEndTravelDateAfterSettingStartDateAndSetEDailyTimeSettingArea(startTravelDate);
          setDailyTimeSettingArea(startTravelDate);
          $("#showingTravelDay").html(travelDay);
          $("#showingTravelDay3").html(travelDay);
          $("#travelDayForRouteMap").html(travelDay);
          $("#travelDay").val(travelDay);
          changeSelectedHotelAreaWhenChangeDate();

          for (var _i = 1; _i < dataFromServer.spotsByDay.length; _i++) {
            selectedHotels.push(dataFromServer.spotsByDay[_i][0]);
          }

          setHotelsWhenHaveToken(selectedHotels); //dataFromServer.originalSchedule

          totalTravelMins = 0;

          for (var _i2 = 0; _i2 < dataFromServer.originalSchedule.length; _i2++) {
            var originalSchedule = dataFromServer.originalSchedule[_i2];
            var startTime = originalSchedule.startTime;
            var endTime = originalSchedule.endTime;
            var dailySpendingMins = getAbsoluteMinuteFromHHMM(endTime) - getAbsoluteMinuteFromHHMM(startTime);

            if (dailySpendingMins < 0) {
              dailySpendingMins += 1440;
            }

            totalTravelMins += dailySpendingMins;
            var startTimeForPresent = startTime.substr(0, 2) + ":" + startTime.substr(2, 4);
            var endTimeForPresent = endTime.substr(0, 2) + ":" + endTime.substr(2, 4);
            $('input[name="dailyStartTimes"]')[_i2].value = startTimeForPresent;
            $('input[name="dailyEndTimes"]')[_i2].value = endTimeForPresent;
          }

          var totalTravelH = Math.floor(totalTravelMins / 60);
          var totalTravelM = Math.floor(totalTravelMins % 60);
          $("#totalTravelH").html(totalTravelH);
          $("#totalTravelM").html(totalTravelM);
          $(".myro2-multibtndiv-modal").css("left", "360px");
          $("#cart2NoList").css("display", "none");
          $("#getScheduleFileByExcelBtnT").css("display", "block");
          $("#copyRouteTokenBtnT").css("display", "block");
          $("#saveButton").html("<h8>수정완료</h8>");
          closePlanSideBar();
          modifyModeDeActivate();
          openPlanPageWidely = false;
          setMap(dataFromServer);
          hideLoading();
        }
      });
    }
  } else {
    //모바일에서 페이지 오픈 시 캘린더 버튼 클릭하여 달력 출력하기
    if ($(window).width() <= 600) {
      calander.click();
    }
  }
});