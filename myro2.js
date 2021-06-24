"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var opened = true,
    psOpened = true,
    SsOpened = false,
    travelDay = 5,
    spot,
    spotsByDay,
    map,
    map2,
    firstSpotSearchFlag = true;
var checkBeforeCloseWindow = true; //let colors = ['#FF2600', '#FFC649', '#3F51B5', '#008F00', '#FF8AD8', '#03A9F4', '#9C27B0', '#8BC34A', '#FF9E07', '#607D8B'];

var colors = ['#FF2600', '#FFC649', '#1F6AEC', '#008F00', '#FF8AD8', '#03A9F4', '#9C27B0', '#8BC34A', '#FF9E07', '#607D8B'];
w3_PSclose(); // 변경사항이 있을 때 뒤로가기 & 새로고침 막기

window.onbeforeunload = function () {
  if (checkBeforeCloseWindow) {
    return "";
  }
};

function w3_open_or_close() {
  if (opened) w3_close();else w3_open();
}

function w3_open() {
  opened = true;
  document.getElementById("mySidebar").style.display = "block";

  if ($(window).width() <= 1600) {
    $('.myro2-multibtndiv').css("left", "290px");
    $('.msb-bookmarkdiv').css("left", "260px");
  } else {
    $('.myro2-multibtndiv').css("left", "320px");
    $('.msb-bookmarkdiv').css("left", "290px");
  }

  $('.msb-bookmarkdiv-i').html("keyboard_arrow_left");
  $('.msb-bookmarkdiv').addClass("animate-left");
}

function w3_close() {
  opened = false;
  document.getElementById("mySidebar").style.display = "none";
  $('.myro2-multibtndiv').css("left", "20px");
  $('.msb-bookmarkdiv').css("left", "-10px");
  $('.msb-bookmarkdiv-i').html("keyboard_arrow_right");
  $('.msb-bookmarkdiv').removeClass("animate-left");
}

function w3_PSopen_or_PSclose() {
  if (psOpened) w3_PSclose();else w3_PSopen();
}

function w3_PSopen() {
  psOpened = true;
  document.getElementById("PSidebar").style.display = "block";

  if ($(window).width() <= 1600) {
    $('.ssb-bookmarkdiv').css("right", "220px");
  } else {
    $('.ssb-bookmarkdiv').css("right", "290px");
  }

  $('.ssb-bookmarkdiv-i').html("keyboard_arrow_right");
  $('.ssb-bookmarkdiv').addClass("animate-right");
}

function w3_PSclose() {
  psOpened = false;
  document.getElementById("PSidebar").style.display = "none";
  $('.ssb-bookmarkdiv').css("right", "-10px");
  $('.ssb-bookmarkdiv-i').html("keyboard_arrow_left");
  $('.ssb-bookmarkdiv').removeClass("animate-right");
}

function w3_SSopen_or_SSclose() {
  if (SsOpened) w3_SSclose();else w3_SSopen();
}

function w3_SSopen() {
  SsOpened = true;
  document.getElementById("SSbarAfterMakeRoute").style.display = "block";
  $('#ssbmbtndiv-Lbtn').css("display", "none");
  $('#ssbmbtndiv').css("display", "block");

  if ($(window).width() <= 600) {
    $('#ssbmbtndiv').css("right", "210px");
    $('#userGuideMenu').css("display", "none");
  } else if ($(window).width() <= 1600) {
    $('#ssbmbtndiv').css("right", "210px");
  } else {
    $('#ssbmbtndiv').css("right", "230px");
  }

  $('#ssbmbtntext').html(i18nSvc.get('closePannel'));
  $("#searchSpotKeywordAfterMakeRoute").focus();
}

function w3_SSclose() {
  SsOpened = false;
  document.getElementById("SSbarAfterMakeRoute").style.display = "none";
  $('#ssbmbtndiv-Lbtn').css("display", "block");
  $('#ssbmbtndiv').css("display", "none");
  $('#ssbmbtntext').html(i18nSvc.get('openPannel'));

  if ($(window).width() <= 600) {
    $('#userGuideMenu').css("display", "block");
  }
}

var hotelMarker,
    hotelMarkers = [];
var marker,
    markers = [];
var markersOnRouteMap = [];
var hotelMarkersOnRouteMap = [];
var searchedSpotsList = [],
    searchedSpotsListFromRecommendedCourse = [];
var selectedSpots = [];
var selectedHotels = [];
var dataFromServer, backupDataFromServer, backupDataFromSavedToken, infowindow, stayingInfos;
var flightPath = [];
var searchKeywordForNextPage = "",
    pageNumForNextPage = 1,
    spotOrHotelForNextPage = "",
    lastPage = 0;
var hideToast;
var totalTravelMins = 3600,
    sumOfSpotStayingMins = 0;
var tempMarkerForInfobox;
var startTravelDate, endTravelDate, savedRouteToken;
var openPlanPageWidely = false;
var socket;
var isClickedToPreventMaker = false;
var savedXForOpenPage;
var trackingData = cityName + " || ",
    durationSec = 0;
var recommendedcoursesNo;
var weekDayKor = i18nSvc.get('weekDays');
var searchInfoForRegSpot;
setInterval(function () {
  durationSec++;
}, 1000); //검색목록 페이징

function searchSpotsNextPage(np) {
  if (np == 'n') {
    if (pageNumForNextPage == lastPage - 1) {
      return;
    }

    pageNumForNextPage++;
  } else if (np == 'p') {
    if (pageNumForNextPage == 0) {
      return;
    }

    pageNumForNextPage--;
  }

  $.ajax({
    type: 'GET',
    url: headAddress + '/search' + spotOrHotelForNextPage + 's',
    data: {
      cityName: cityName,
      keyword: searchKeywordForNextPage,
      pageNumForNextPage: pageNumForNextPage
    },
    success: function success(data) {
      $("#PSidebar").scrollTop(0);
      makePagesForSearchedList(pageNumForNextPage, lastPage);
      deleteAllSpotsList();
      searchedSpotsList = data; //장소

      if (spotOrHotelForNextPage == "Spot") {
        for (var i = 0; i < searchedSpotsList.length; i++) {
          var addFlag = true;

          for (var j = 0; j < selectedSpots.length; j++) {
            if (selectedSpots[j].no == searchedSpotsList[i].no) {
              addFlag = false;
              continue;
            }
          }

          if (addFlag) {
            appendSearchedSpotsList(searchedSpotsList[i]);
          }
        }
      } //호텔
      else if (spotOrHotelForNextPage == "Hotel") {
          for (var _i = 0; _i < searchedSpotsList.length; _i++) {
            appendSearchedHotelList(searchedSpotsList[_i]);
          }
        }
    }
  });
  addUserTrackingData('searchSpotsNextPage|' + np + '|' + pageNumForNextPage);
} //추천호텔 출력


function searchMostSelectedHotels() {
  $("#spotsNoListText2").css("display", "none");
  deleteAllSpotsList();
  $("#searchOrRecommend").html(i18nSvc.get('recommendedHotels'));
  $("#searchResultCnt").html("");
  $.ajax({
    type: 'GET',
    url: headAddress + '/searchMostSelectedHotels',
    data: {
      cityName: cityName
    },
    success: function success(data) {
      $("[name=searchSpotOrHotelRadio]")[0].checked = true;
      searchedSpotsList = data;
      $("#pageList").html(""); //$("#spotsNoListText2").css("display", "none");

      $("#spotsNoListText").css("display", "none");

      for (var i = 0; i < searchedSpotsList.length; i++) {
        appendSearchedHotelList(searchedSpotsList[i]);
        w3_PSopen();
      }
    }
  });
} //추천장소 출력


function searchMostSelectedSpots() {
  $("#spotsNoListText2").css("display", "none");
  deleteAllSpotsList();
  $("#searchOrRecommend").html(i18nSvc.get('recommendedSpots'));
  $("#searchResultCnt").html("");
  $.ajax({
    type: 'GET',
    url: headAddress + '/searchMostSelectedSpots',
    data: {
      cityName: cityName
    },
    success: function success(data) {
      $("[name=searchSpotOrHotelRadio]")[1].checked = true;
      searchedSpotsList = data;
      $("#pageList").html("");
      $("#spotsNoListText").css("display", "none");

      for (var i = 0; i < searchedSpotsList.length; i++) {
        var addFlag = true;

        for (var j = 0; j < selectedSpots.length; j++) {
          if (selectedSpots[j].no == searchedSpotsList[i].no) {
            addFlag = false;
            continue;
          }
        }

        if (addFlag) {
          appendSearchedSpotsList(searchedSpotsList[i]);
        }

        w3_PSopen();
      }
    }
  });
} //페이징 숫자 출력


function makePagesForSearchedList(currentPage, lastPage) {
  $("#searchOrRecommend").html(i18nSvc.get('searchedResult'));
  var showingPage = 5;
  var realCurrentPage = currentPage;

  if (lastPage < 5) {
    showingPage = lastPage;
    currentPage = 0;
  } else if (currentPage == 0 || currentPage == 1 || currentPage == 2) {
    currentPage = 0;
  } else if (currentPage == lastPage - 1) {
    currentPage = currentPage - 4;
  } else if (currentPage == lastPage - 2) {
    currentPage = currentPage - 3;
  } else {
    currentPage = currentPage - 2;
  }

  $("#spotsNoListText").css("display", "none");
  $("#pageSectionDiv").css("display", "block");
  $("#pageList").html("");

  for (var i = currentPage; i < currentPage + showingPage; i++) {
    $("#pageList").append('<a onclick="searchSpotsCertainPage(' + i + ')" id="pageButton' + i + '" class="s-button">' + (i + 1) + '</a>');

    if (i == realCurrentPage) {
      $("#pageButton" + i).css({
        "font-weight": "bold",
        "background-color": "#000000",
        "color": "#ffffff",
        "border-radius": "2px"
      });
    }
  }
}

function searchSpotsCertainPage(pageNum) {
  pageNumForNextPage = pageNum;
  searchSpotsNextPage();
  makePagesForSearchedList(pageNum, lastPage);
} //호텔 혹은 장소 검색


function searchSpotsOrHotels() {
  if ($("[name=searchSpotOrHotelRadio]")[0].checked == true) {
    searchHotels();
  } else if ($("[name=searchSpotOrHotelRadio]")[1].checked == true) {
    searchSpots();
  }
}

var searchKeywordForNextPageAfterMakeRoute, pageNumForNextPageAfterMakeRoute, searchedSpotsListAfterMakeRoute; //일정생성 후 장소 추가등록 검색

function searchSpotsAfterMakeRoute() {
  if ($("#searchSpotKeywordAfterMakeRoute").val().length < 2) {
    showToastMsg(i18nSvc.get('moreThanTwoLettersForSearchingKeyword'));
    return;
  }

  searchKeywordForNextPageAfterMakeRoute = $("#searchSpotKeywordAfterMakeRoute").val();
  pageNumForNextPageAfterMakeRoute = 0;
  w3_SSopen();
  $.ajax({
    type: 'GET',
    url: headAddress + '/searchSpots',
    data: {
      cityName: cityName,
      keyword: $("#searchSpotKeywordAfterMakeRoute").val()
    },
    success: function success(data) {
      $.ajax({
        type: 'GET',
        url: headAddress + '/getSpotsCnt',
        data: {
          cityName: cityName,
          keyword: $("#searchSpotKeywordAfterMakeRoute").val()
        },
        success: function success(cnt) {
          if (cnt[0].cnt > 15) {
            showToastMsg(i18nSvc.get('moreThan15Results'));
          }

          if (cnt[0].cnt == 0) {
            $("#AfterMakeRouteText").css("display", "none");
            showToastMsg(i18nSvc.get('noSearchResult'));
          } //페이징은 나중에
          // $("#searchResultCnt").html("(" + cnt[0].cnt + "건)");
          // lastPage = Math.ceil(cnt[0].cnt / 15);
          // makePagesForSearchedList(0, lastPage);

        }
      });
      deleteAllSpotsListAfterMakeRoute();
      searchedSpotsListAfterMakeRoute = data;

      for (var i = 0; i < searchedSpotsListAfterMakeRoute.length; i++) {
        var addFlag = true;

        for (var j = 0; j < dataFromServer.spotsByDay.length; j++) {
          for (var k = 1; k < dataFromServer.spotsByDay[j].length; k++) {
            var _spot = dataFromServer.spotsByDay[j][k];

            if (_spot.no == searchedSpotsListAfterMakeRoute[i].no) {
              addFlag = false;
              continue;
            }
          }
        }

        if (addFlag) {
          appendSearchedSpotsListAfterMakeRoute(searchedSpotsListAfterMakeRoute[i]);
        }
      }
    }
  });
  addUserTrackingData('searchSpotsAfterMakeRoute|' + searchKeywordForNextPageAfterMakeRoute);
} //장소 추가등록 검색결과에서 포함되지 않은 장소 목록에 선택장소 추가 


function addSpotToOmittedPlaces(no) {
  for (var i = 0; i < searchedSpotsListAfterMakeRoute.length; i++) {
    var _spot2 = searchedSpotsListAfterMakeRoute[i];

    if (_spot2.no == no) {
      dataFromServer.stayingInfos[0].push({
        start: 0,
        finish: 0,
        fromPrevious: 0
      });
      _spot2.openTime = JSON.parse(_spot2.openTime);
      _spot2.realStaySec = _spot2.recommendedStaySec;
      _spot2.memo = "";
      dataFromServer.spotsByDay[0].push(_spot2);
      $('#appendDivAfterMakeRoute' + no).remove();
      setMap(dataFromServer);
      $("#searchSpotKeywordAfterMakeRoute").val("");

      if ($(window).width() > 600) {
        $("#searchSpotKeywordAfterMakeRoute").focus();
      }

      modifyModeActivate();
      setMsidebar2AsItIs();
      break;
    }
  }
} //호텔검색


function searchHotels() {
  if ($("#searchSpotOrHotelKeyword").val().length < 2) {
    showToastMsg(i18nSvc.get('moreThanTwoLettersForSearchingKeyword'));
    return;
  }

  searchKeywordForNextPage = $("#searchSpotOrHotelKeyword").val();
  pageNumForNextPage = 0;
  spotOrHotelForNextPage = "Hotel";
  w3_PSopen();
  $.ajax({
    type: 'GET',
    url: headAddress + '/searchHotels',
    data: {
      cityName: cityName,
      keyword: $("#searchSpotOrHotelKeyword").val()
    },
    success: function success(data) {
      $.ajax({
        type: 'GET',
        url: headAddress + '/getHotelsCnt',
        data: {
          cityName: cityName,
          keyword: $("#searchSpotOrHotelKeyword").val()
        },
        success: function success(cnt) {
          $("#searchResultCnt").html("(" + cnt[0].cnt + i18nSvc.get('resultCnt') + ")");
          lastPage = Math.ceil(cnt[0].cnt / 15);
          makePagesForSearchedList(0, lastPage);
        }
      });

      if (firstSpotSearchFlag) {
        registerSpotToast();
        firstSpotSearchFlag = false;

        if (data.length == 0) {
          $("#spotsNoListText2").css("display", "block");
        }
      } else if (data.length == 0) {
        registerSpotToast();
        $("#spotsNoListText2").css("display", "block");
      } else {
        $("#spotsNoListText2").css("display", "none");
      }

      deleteAllSpotsList();
      searchedSpotsList = data;

      for (var i = 0; i < searchedSpotsList.length; i++) {
        appendSearchedHotelList(searchedSpotsList[i]);
      }
    }
  });
  addUserTrackingData('searchHotels|' + searchKeywordForNextPage);
} //장소검색


function searchSpots() {
  if ($("#searchSpotOrHotelKeyword").val().length < 2) {
    showToastMsg(i18nSvc.get('moreThanTwoLettersForSearchingKeyword'));
    return;
  }

  searchKeywordForNextPage = $("#searchSpotOrHotelKeyword").val();
  pageNumForNextPage = 0;
  spotOrHotelForNextPage = "Spot";
  w3_PSopen();
  $.ajax({
    type: 'GET',
    url: headAddress + '/searchSpots',
    data: {
      cityName: cityName,
      keyword: $("#searchSpotOrHotelKeyword").val()
    },
    success: function success(data) {
      $.ajax({
        type: 'GET',
        url: headAddress + '/getSpotsCnt',
        data: {
          cityName: cityName,
          keyword: $("#searchSpotOrHotelKeyword").val()
        },
        success: function success(cnt) {
          $("#searchResultCnt").html("(" + cnt[0].cnt + i18nSvc.get('resultCnt') + ")");
          lastPage = Math.ceil(cnt[0].cnt / 15);
          makePagesForSearchedList(0, lastPage);
        }
      });

      if (firstSpotSearchFlag) {
        registerSpotToast();
        firstSpotSearchFlag = false;

        if (data.length == 0) {
          $("#spotsNoListText2").css("display", "block");
        }
      } else if (data.length == 0) {
        registerSpotToast();
        $("#spotsNoListText2").css("display", "block");
      } else {
        $("#spotsNoListText2").css("display", "none");
      }

      deleteAllSpotsList();
      searchedSpotsList = data;

      for (var i = 0; i < searchedSpotsList.length; i++) {
        var addFlag = true;

        for (var j = 0; j < selectedSpots.length; j++) {
          if (selectedSpots[j].no == searchedSpotsList[i].no) {
            addFlag = false;
            continue;
          }
        }

        if (addFlag) {
          appendSearchedSpotsList(searchedSpotsList[i]);
        }
      }
    }
  });
  addUserTrackingData('searchSpots|' + searchKeywordForNextPage);
} //여행일자 세팅


function setTravelDay() {
  travelDay = $('#travelDay').val();
} //장소 검색결과 목록에 추가


function appendSearchedSpotsList(spot) {
  var bookmark = "",
      titleForPlaceType = "",
      backgroundColor;

  if (spot.isSpot == 0) {
    bookmark = "restaurant";
    titleForPlaceType = i18nSvc.get('restaurant');
    backgroundColor = "#ff4081";
  } else if (spot.isSpot == 1) {
    bookmark = "account_balance";
    titleForPlaceType = i18nSvc.get('spot');
  }

  var showingName = spot.showingName;

  if (showingName.indexOf("(") != -1) {
    if ($(window).width() <= 600) {
      showingName = showingName.split("(")[0];
    } else {
      showingName = showingName.split("(")[0] + "<br>(" + showingName.split("(")[1];
    }
  }

  var newSearchedSpot = '<li class="card horizontal hoverable" style="padding:0;" id="appendDiv' + spot.no + '">' + '<div><div><div class="centered"><div class="spotphotolinear"></div><img src="' + headAddress + '/getSpotImage/' + cityName + '?no=' + spot.no + '" alt="Image" id="cartImgNo' + spot.no + '"></div></div></div>' + '<div class="placecardbookmark" style="top:1px!important;background-color:' + backgroundColor + '"><i title="' + titleForPlaceType + '" class="material-icons placecardbookmark_mi">' + bookmark + '</i></div>' + '<div class="placelistndwrap"><span class="placelistnd2" title="' + spot.showingName + '"><h7>&nbsp' + showingName + '</h7></span>' + '<div class="spotselectedCnt"><h7><i class="material-icons">pin_drop</i>' + spot.selectedCnt.toLocaleString() + '</h7></div></div>' + '<div class="spotBtnWrap"><div title=' + i18nSvc.get('selectPlace') + ' class="btn waves-effect spotbtncss" onclick="addSpotToSelectedSpots(' + spot.no + ')"><i class="material-icons">add</i></div>' + '<div title="' + i18nSvc.get('searchAtGoogle') + '" class="btn waves-effect spotbtncss spotbtnsearch" onclick="searchInWeb(\'google\', \'' + spot.showingName.replace("\'", "\\'") + '\', \'' + spot.lat + '\', \'' + spot.lng + '\')" ><i class="material-icons">search</i></div></div></li>';
  $("#spotsList").append(newSearchedSpot);
  $('#appendDiv' + spot.no).hover(function () {
    if (!isClickedToPreventMaker) {
      map.panTo({
        lat: spot.lat,
        lng: spot.lng
      });
      setMarkerOnMap(spot);
      setInfoboxOnMap(i18nSvc.get('placeName') + " : " + spot.showingName + "<br>" + i18nSvc.get('address') + " : " + spot.address, marker);
    }
  }, function () {
    deleteMarkerOnMap(spot);

    if (infowindow) {
      infowindow.close();
    }
  });
} //일정 생성 후 장소 검색결과 목록에 추가


function appendSearchedSpotsListAfterMakeRoute(spot) {
  spot.whatDay = 0;
  var bookmark = "",
      titleForPlaceType = "",
      backgroundColor;

  if (spot.isSpot == 0) {
    bookmark = "restaurant";
    titleForPlaceType = i18nSvc.get('restaurant');
    backgroundColor = "#ff4081";
  } else if (spot.isSpot == 1) {
    bookmark = "account_balance";
    titleForPlaceType = i18nSvc.get('spot');
  }

  var showingName = spot.showingName;

  if (showingName.indexOf("(") != -1) {
    if ($(window).width() <= 600) {
      showingName = showingName.split("(")[0];
    } else {
      showingName = showingName.split("(")[0] + "<br>(" + showingName.split("(")[1];
    }
  }

  var newSearchedSpot;

  if ($(window).width() <= 600) {
    newSearchedSpot = '<li class="card" style="padding:0;margin:4px;" id="appendDivAfterMakeRoute' + spot.no + '">' + '<div style="display: flex;height: 48px;">' + '<div class="afterMakeCardImgCss">' + '<img src="' + headAddress + '/getSpotImage/' + cityName + '?no=' + spot.no + '" alt="Image" style="width:48px;height: 48px;">' + '<div class="placecardbookmark_AMR" style="background-color:' + backgroundColor + '; position: relative!important;top:-47px!important;"><i title="' + titleForPlaceType + '" class="material-icons placecardbookmark_mi_AMR" style="padding: 0!important;margin: 0!important;left: 3px;top: 3px;">' + bookmark + '</i></div>' + '</div>' + '<div class="placecardtextstyle">' + '<h7 class="modalSSDDdiv">' + spot.showingName + '</h7>' + '<button class="btn waves-effect waves-light spotbtncssAMRM" onclick="addSpotToOmittedPlaces(' + spot.no + ')"><hs style="vertical-align: 2px;" id="">' + i18nSvc.get('addPlace') + '</hs></button>' + '</div>' + '</div>' + '</li>';
  } else {
    newSearchedSpot = '<li class="card horizontal hoverable" style="padding:0;margin:4px;" id="appendDivAfterMakeRoute' + spot.no + '">' + '<div><div><div class="centered"><div class="spotphotolinear_AMR"></div><img src="' + headAddress + '/getSpotImage/' + cityName + '?no=' + spot.no + '" alt="Image" class="AfterMakeRouteSpotImg"></div></div></div>' + '<div class="placecardbookmark_AMR" style="background-color:' + backgroundColor + '"><i title="' + titleForPlaceType + '" class="material-icons placecardbookmark_mi_AMR">' + bookmark + '</i></div>' + '<div class="placelistndwrap"><span class="placelistnd3" title="' + spot.showingName + '"><h7 style="font-size: 11px;">&nbsp' + showingName + '</h7></span></div>' + '<div class="spotBtnWrap"><div title="' + i18nSvc.get('addSpotToOmittedPlaces') + '" class="btn waves-effect spotbtncssAMR" onclick="addSpotToOmittedPlaces(' + spot.no + ')"><i class="material-icons" style="font-size:14px">add</i></div>' + '</div></li>';
  }

  $("#AfterMakeRouteText").css("display", "block");
  $("#spotsListAfterMakeRoute").append(newSearchedSpot);
  $('#appendDivAfterMakeRoute' + spot.no).hover(function () {
    if (!isClickedToPreventMaker) {
      map2.panTo({
        lat: spot.lat,
        lng: spot.lng
      });
      setMarkerOnRouteMap(spot);
      setInfoboxOnMap(i18nSvc.get('placeName') + " : " + spot.showingName + "<br>" + i18nSvc.get('address') + " : " + spot.address, marker);
    }
  }, function () {
    deleteMarkerOnRouteMap(spot);
    infowindow.close();
  });
} //검색장소 구글에서 장소 검색


function searchInWeb(site, searchKeyword, x, y) {
  var searchUrl;

  if (site == 'naver') {
    searchUrl = 'https://search.naver.com/search.naver?query=' + searchKeyword;
  } else if (site == 'google') {
    searchUrl = 'https://www.google.com/maps/search/' + searchKeyword + '/@' + x + ',' + y + ',12z/data=!3m1!4b1';
  } else if (site == 'instagram') {
    searchUrl = 'https://www.instagram.com/explore/tags/' + searchKeyword;
  } else if (site == 'myrealtrip') {
    searchUrl = 'https://www.myrealtrip.com/q/' + searchKeyword;
  } else return;

  window.open(searchUrl);
  addUserTrackingData('searchInWeb|' + site + '|' + searchKeyword);
} //호텔 검색결과 목록에 추가


function appendSearchedHotelList(spot) {
  var showingName = spot.showingName;

  if (showingName.indexOf("(") != -1) {
    if ($(window).width() <= 600) {
      showingName = showingName.split("(")[0];
    } else {
      showingName = showingName.split("(")[0] + "<br>(" + showingName.split("(")[1];
    }
  }

  var newSearchedSpot = '<li class="card horizontal hoverable" style="padding:0;" id="appendDiv' + spot.no + '">' + '<div><div class="centered"><div class="dayDisplayWrapStyle" id="dayDisplayWrap' + spot.no + '"></div><img src="' + headAddress + '/getHotelImage/' + cityName + '?no=' + spot.no + '" alt="Image" ></div></div>' + //        '<div class="placecardbookmark" style="top:1px!important;background-color:#1a237e"><i class="material-icons placecardbookmark_mi">hotel</i></div>' +
  '<div class="placelistndwrap"><span class="placelistnd2" title="' + spot.showingName + '"><h7>&nbsp' + showingName + '</h7></span></div>' + '<div class="spotselectedCnt"><h7><i class="material-icons">check_circle</i>' + spot.selectedCnt.toLocaleString() + '</h7></div></div>' + '<div class="spotBtnWrap"><div title="' + i18nSvc.get('selectHotel') + '" class="btn waves-effect spotbtncss" onclick="setHotel(' + spot.no + ')"><i class="material-icons">event_available</i></div>' + '<div title="' + i18nSvc.get('searchAtGoogle') + '" class="btn waves-effect spotbtncss spotbtnsearch" onclick="searchInWeb(\'google\', \'' + spot.showingName + '\', \'' + spot.lat + '\', \'' + spot.lng + '\')" ><i class="material-icons">search</i></div></div></li>';
  $("#spotsList").append(newSearchedSpot); // 호텔 라벨넘버 마킹 '시작'(LSH)

  for (var j = 0; j < selectedHotels.length; j++) {
    if (selectedHotels[j] == null) {//showToastMsg("호텔이 설정되지 않은 날이 있습니다. 호텔을 추가해주세요.");
    } else if (selectedHotels[j].no == spot.no) {
      var DayLText = void 0;

      if (travelDay > 7) {
        DayLText = 'D';
      } else {
        DayLText = 'Day';
      }

      var dayDisplayBadge = '<div id="hotelSetDayLabel' + [j + 1] + '" class="hotelCardDayMark"><hs style="padding:1px;">' + DayLText + '' + [j + 1] + '</hs></div>';
      $("#dayDisplayWrap" + spot.no).append(dayDisplayBadge);
    }
  } // 호텔 라벨넘버 마킹 '끝'


  $('#appendDiv' + spot.no).hover(function () {
    map.panTo({
      lat: spot.lat,
      lng: spot.lng
    });
    setMarkerOnMap(spot, 'hotel');
  }, function () {
    deleteMarkerOnMap(spot);
  });
}

function deleteAllSpotsList() {
  $("#spotsList").html("");
}

function deleteAllSpotsListAfterMakeRoute() {
  $("#spotsListAfterMakeRoute").html("");
} //일자별 호텔 설정


function setHotel(no) {
  var hotelChekedDay;

  for (var i = 0; i < $('input[name="hotelDay"]').length; i++) {
    if ($('input[name="hotelDay"]')[i].checked) {
      hotelChekedDay = i;
    }
  }

  for (var _i2 = 0; _i2 < searchedSpotsList.length; _i2++) {
    if (searchedSpotsList[_i2].no == no) {
      spot = searchedSpotsList[_i2];
      break;
    }
  }

  var hotel = spot;
  setHotelMarkerOnMap(hotel, hotelChekedDay);
  var addCart = '<li class="display-container fade-in-right card hoverable addcarthoteldiv1" id="hotelCartDay' + hotelChekedDay + '">' + '<div style="display:flex"><div>' + '<img src="' + headAddress + '/getSpotImage/' + cityName + '?no=' + hotel.no + '" alt="Image"></div>' + '<div style="margin-left:5px"><h7 style="width:11rem" class="placelistndsh" title="' + hotel.showingName + '">' + hotel.showingName + '</h7><hs style="color:#aaa">' + i18nSvc.get('checkStayingDate') + '</hs></div><div onclick="removeSelectedHotel(' + hotelChekedDay + ')" class="btn addcarthoteldivbtn">' + '<i title="' + i18nSvc.get('removeFromSelectedList') + '" class="material-icons">clear</i></div></div></li>';
  $("#selecteHotelsTab").get(0).click();
  closeDailyTimesSettingArea();
  $("#day" + hotelChekedDay + "SelectedhotelInfo").html("");
  $("#day" + hotelChekedDay + "SelectedhotelInfo").append(addCart);
  $("#day" + hotelChekedDay + "hotelInfo").css("display", "none"); // 호텔 라벨넘버 마킹 '시작'(LSH)

  var DayLText;

  if (travelDay > 7) {
    DayLText = 'D';
  } else {
    DayLText = 'Day';
  }

  var dayDisplayBadge = '<div id="hotelSetDayLabel' + [hotelChekedDay + 1] + '" class="hotelCardDayMark"><hs style="padding:1px;">' + DayLText + '' + [hotelChekedDay + 1] + '</hs></div>';

  if (hotelChekedDay != $("#hotelSetDayLabel" + [hotelChekedDay]).length - 1) {
    $("#hotelSetDayLabel" + [hotelChekedDay + 1]).remove();
  }

  $("#dayDisplayWrap" + spot.no).append(dayDisplayBadge);
  showToastMsg([hotelChekedDay + 1] + i18nSvc.get('whenSelectedHotel')); // 호텔 라벨넘버 마킹 '끝'

  if (hotelChekedDay != $('input[name="hotelDay"]').length - 1) {
    $('input[name="hotelDay"]')[hotelChekedDay + 1].checked = true;
    $('input[name="hotelDay"]')[hotelChekedDay + 1].focus();
  } else {
    $('input[name="hotelDay"]')[0].checked = true;
    $('input[name="hotelDay"]')[0].focus();
  }

  selectedHotels[hotelChekedDay] = hotel;
  refreshSeletedHotelsCnt(); // 임시 카트에 담기

  addUserTrackingData('setHotel|' + no);
} //토큰 가지고 들어올때 호텔 설정하기


function setHotelsWhenHaveToken() {
  // if (hotelMarker && hotelMarker.setMap) hotelMarker.setMap(null);
  // hotelMarker = new google.maps.Marker({
  //     position: {
  //         lat: hotel.lat,
  //         lng: hotel.lng
  //     },
  //     label: "",
  //     icon: '/myro_image/hotel-img.png', // 이미지주소변경(LSH)
  //     animation: google.maps.Animation.DROP,
  //     map: map,
  // });
  // hotelMarker.setMap(map);
  // hotelMarker.addListener('click', function () {
  //     openLocationInfo("" + hotel.showingName + "<br>주소 : " + hotel.address, hotelMarker, 'Hotel', hotel.no);
  // });
  for (var i = 0; i < selectedHotels.length; i++) {
    var hotelChekedDay = i;
    var hotel = selectedHotels[i];
    setHotelMarkerOnMap(hotel, hotelChekedDay);
    var addCart = '<li class="display-container fade-in-right card hoverable addcarthoteldiv1" id="hotelCartDay' + hotelChekedDay + '">' + '<div style="display:flex"><div>' + '<img src="' + headAddress + '/getSpotImage/' + cityName + '?no=' + hotel.no + '" alt="Image"></div>' + '<div style="margin-left:5px"><h7 style="width:11rem" class="placelistndsh" title="' + hotel.showingName + '">' + hotel.showingName + '</h7><hs style="color:#aaa">' + i18nSvc.get('checkStayingDate') + '</hs></div><div onclick="removeSelectedHotel(' + hotelChekedDay + ')" class="btn addcarthoteldivbtn">' + '<i title="' + i18nSvc.get('removeFromSelectedList') + '" class="material-icons">clear</i></div></div></li>';
    $("#day" + hotelChekedDay + "SelectedhotelInfo").html("");
    $("#day" + hotelChekedDay + "SelectedhotelInfo").append(addCart);
    $("#day" + hotelChekedDay + "hotelInfo").css("display", "none");
  }

  refreshSeletedHotelsCnt();
} //검색된 장소 선택시 장바구니에 추가


function addSpotToSelectedSpots(no, isFromSelectAllRecommendCourse) {
  $("#selecteSpotsTab").get(0).click(); // 장소장바구니탭으로 이동(LSH)

  closeDailyTimesSettingArea();

  if (infowindow) {
    infowindow.close();
  }

  if (!$('#travelDay').val()) {
    showToastMsg(i18nSvc.get('setYourTravelDate'));
    return;
  }

  if ((selectedSpots.length + 1) / $('#travelDay').val() > 7) {
    if (!isFromSelectAllRecommendCourse) {
      showToastMsg(i18nSvc.get('cantChooseMoreThan8PlacesPerDayForAverage'));
    }

    return;
  } ////// 장소 선택했을 때 왼쪽 선택목록으로 날아가는 효과
  //    var cart = $('#seletedSpotsCnt');
  //    var imgtodrag = $('#cartImgNo' + no).eq(0);
  //    if (imgtodrag) {
  //        var imgclone = imgtodrag.clone()
  //            .offset({
  //                top: imgtodrag.offset().top,
  //                left: imgtodrag.offset().left
  //            })
  //            .css({
  //                'opacity': '0.9',
  //                'position': 'absolute',
  //                'height': '55px',
  //                'width': '60px',
  //                'z-index': '100'
  //            })
  //            .appendTo($('body'))
  //            .animate({
  //                'top': cart.offset().top + 12,
  //                'left': cart.offset().left + 3,
  //                'width': 20,
  //                'height': 15
  //            }, 600, 'easeInOutExpo');
  //
  //        imgclone.animate({
  //            'width': 0,
  //            'height': 0
  //        }, function () {
  //            $(this).detach()
  //        });
  //    }


  var spot;

  for (var i = 0; i < searchedSpotsList.length; i++) {
    if (searchedSpotsList[i].no == no) {
      spot = searchedSpotsList[i];
      continue;
    }
  }

  if (!spot) {
    for (var _i3 = 0; _i3 < searchedSpotsListFromRecommendedCourse.length; _i3++) {
      if (searchedSpotsListFromRecommendedCourse[_i3].no == no) {
        spot = searchedSpotsListFromRecommendedCourse[_i3];
        continue;
      }
    }
  }

  for (var _i4 = 0; _i4 < selectedSpots.length; _i4++) {
    if (selectedSpots[_i4].no == spot.no && !isFromSelectAllRecommendCourse) {
      showToastMsg(spot.showingName + i18nSvc.get('isAlreadySelected'));
      return;
    }
  }

  if (sumOfSpotStayingMins + spot.recommendedStaySec / 60 > totalTravelMins) {
    if (!isFromSelectAllRecommendCourse) {
      showToastMsg(i18nSvc.get('sumOfStayingTimeOfPlacesCannotBeGreaterThanTotalTravelTime'));
      $("#totalTravelTimeArea").addClass("blink-2");
      $("#totalSpendingTimeArea").addClass("blink-2");
      setTimeout(function () {
        $("#totalTravelTimeArea").removeClass("blink-2");
        $("#totalSpendingTimeArea").removeClass("blink-2");
      }, 3000);
    }

    return;
  }

  isClickedToPreventMaker = true;
  setTimeout(function () {
    isClickedToPreventMaker = false;
  }, 200);
  sumOfSpotStayingMins += spot.recommendedStaySec / 60;
  var sumOfSpotStayingH = Math.floor(sumOfSpotStayingMins / 60);
  var sumOfSpotStayingM = Math.floor(sumOfSpotStayingMins % 60);
  $("#sumOfSpotStayingH").html(sumOfSpotStayingH);
  $("#sumOfSpotStayingM").html(sumOfSpotStayingM);
  selectedSpots.push(spot);
  $("#chipNo" + no).addClass("chipSelectedCss");
  $("#miNo" + no).html("check");
  $('#appendDiv' + no).remove();
  refreshSeletedSpotsCnt();
  setMarkerOnMap(spot);
  map.panTo({
    lat: spot.lat,
    lng: spot.lng
  });
  var bookmark = "",
      titleForPlaceType,
      backgroundColor;

  if (spot.isSpot == 0) {
    bookmark = "restaurant";
    backgroundColor = "#ff4081";
    titleForPlaceType = i18nSvc.get('restaurant');
  } else if (spot.isSpot == 1) {
    bookmark = "account_balance";
    titleForPlaceType = i18nSvc.get('spot');
  }

  var recommendedStayHours = Math.floor(spot.recommendedStaySec / 3600);
  var recommendedStayMinutes = spot.recommendedStaySec % 3600 / 60;
  var addCart = '<li class="display-container fade-in-right card hoverable addcartspotdiv1" id="cartNo' + spot.no + '">' + '<div style="display:flex"><div>' + '<img src="' + headAddress + '/getSpotImage/' + cityName + '?no=' + spot.no + '" alt="Image"></div>' + '<div class="placecardbookmark" style="background-color:' + backgroundColor + '"><i title="' + titleForPlaceType + '" class="material-icons placecardbookmark_mi">' + bookmark + '</i></div>' + '<div style="margin-left:5px"><h7 class="placelistnd" title="' + spot.showingName + '">' + spot.showingName + '</h7><div class="addcartspotdiv2">' + '<i title="' + i18nSvc.get('stayingTime') + '" class="material-icons">timer</i>&nbsp&nbsp&nbsp&nbsp<input id="' + 'stayingHoursNo' + spot.no + '" type="number" min="0" max="24" value="' + recommendedStayHours + '" size="1">' + i18nSvc.get('hours') + '&nbsp&nbsp&nbsp&nbsp<input id="' + 'stayingMinutesNo' + spot.no + '" type="number" value="' + recommendedStayMinutes + '" size="1" maxlength="2" min="0" max="59">' + i18nSvc.get('min') + '</div></div></div>' + '<div onclick="removeSpotFromSelectedSpots(' + spot.no + ')" class="btn addcartspotdivbtn">' + '<i title="' + i18nSvc.get('removeFromSelectedList') + '" class="material-icons">clear</i></div></li>'; //    $('.selectCardCss').css("display", "block");

  $("#cart2NoList").css("display", "none");
  $("#cart2").append(addCart);
  $("#stayingHoursNo" + spot.no).change(function () {
    if ($("#stayingHoursNo" + spot.no).val() > 23) {
      $("#stayingHoursNo" + spot.no).val(23);
    }

    if ($("#stayingHoursNo" + spot.no).val() < 0) {
      $("#stayingHoursNo" + spot.no).val(0);
    }

    recalculateSumOfSpotStayingMins();
    addUserTrackingData('stayingHours change|' + spot.no + '|' + $("#stayingHoursNo" + spot.no).val());
  });
  $("#stayingMinutesNo" + spot.no).change(function () {
    if ($("#stayingMinutesNo" + spot.no).val() > 59) {
      $("#stayingMinutesNo" + spot.no).val(59);
    }

    if ($("#stayingMinutesNo" + spot.no).val() < 0) {
      $("#stayingMinutesNo" + spot.no).val(0);
    }

    recalculateSumOfSpotStayingMins();
    addUserTrackingData('stayingMinutes change|' + spot.no + '|' + $("#stayingMinutesNo" + spot.no).val());
  });

  function recalculateSumOfSpotStayingMins() {
    if ($("#stayingHoursNo" + spot.no).val() == 0 && $("#stayingMinutesNo" + spot.no).val() == 0) {
      $("#stayingMinutesNo" + spot.no).val(1);
    }

    sumOfSpotStayingMins = 0;

    for (var _i5 = 0; _i5 < selectedSpots.length; _i5++) {
      var _no = selectedSpots[_i5].no;
      sumOfSpotStayingMins += Number($("#stayingHoursNo" + _no).val()) * 60 + Number($("#stayingMinutesNo" + _no).val());
    }

    var sumOfSpotStayingH = Math.floor(sumOfSpotStayingMins / 60);
    var sumOfSpotStayingM = Math.floor(sumOfSpotStayingMins % 60);
    $("#sumOfSpotStayingH").html(sumOfSpotStayingH);
    $("#sumOfSpotStayingM").html(sumOfSpotStayingM);
  }

  w3_open();

  if (!isFromSelectAllRecommendCourse) {
    if ($(window).width() > 600) {
      $("#searchSpotOrHotelKeyword").val("");
      $("#searchSpotOrHotelKeyword").focus();
    }

    addUserTrackingData('addSpotToSelectedSpots|' + no);
  }
} //토큰가지고 들어올때 장바구니에 추가


function addSpotToSelectedSpotsWhenHaveToken(spot) {
  if (infowindow) {
    infowindow.close();
  }

  sumOfSpotStayingMins += spot.realStaySec / 60;
  var sumOfSpotStayingH = Math.floor(sumOfSpotStayingMins / 60);
  var sumOfSpotStayingM = Math.floor(sumOfSpotStayingMins % 60);
  $("#sumOfSpotStayingH").html(sumOfSpotStayingH);
  $("#sumOfSpotStayingM").html(sumOfSpotStayingM);
  selectedSpots.push(spot);
  refreshSeletedSpotsCnt();
  setMarkerOnMap(spot);
  var bookmark = "",
      titleForPlaceType,
      backgroundColor;

  if (spot.isSpot == 0) {
    bookmark = "restaurant";
    backgroundColor = "#ff4081";
    titleForPlaceType = i18nSvc.get('restaurant');
  } else if (spot.isSpot == 1) {
    bookmark = "account_balance";
    titleForPlaceType = i18nSvc.get('spot');
  }

  var recommendedStayHours = Math.floor(spot.realStaySec / 3600);
  var recommendedStayMinutes = spot.realStaySec % 3600 / 60;
  var addCart = '<li class="display-container fade-in-right card hoverable addcartspotdiv1" id="cartNo' + spot.no + '">' + '<div style="display:flex"><div>' + '<img src="' + headAddress + '/getSpotImage/' + cityName + '?no=' + spot.no + '" alt="Image"></div>' + '<div class="placecardbookmark" style="background-color:' + backgroundColor + '"><i title="' + titleForPlaceType + '" class="material-icons placecardbookmark_mi">' + bookmark + '</i></div>' + '<div style="margin-left:5px"><h7 class="placelistnd" title="' + spot.showingName + '">' + spot.showingName + '</h7><div class="addcartspotdiv2">' + '<i title="' + i18nSvc.get('stayingTime') + '" class="material-icons">timer</i>&nbsp&nbsp&nbsp&nbsp<input id="' + 'stayingHoursNo' + spot.no + '" type="number" min="0" max="24" value="' + recommendedStayHours + '" size="1">' + i18nSvc.get('hours') + '&nbsp&nbsp&nbsp&nbsp<input id="' + 'stayingMinutesNo' + spot.no + '" type="number" value="' + recommendedStayMinutes + '" size="1" maxlength="2" min="1" max="59">' + i18nSvc.get('min') + '</div></div></div>' + '<div onclick="removeSpotFromSelectedSpots(' + spot.no + ')" class="btn addcartspotdivbtn">' + '<i title="' + i18nSvc.get('removeFromSelectedList') + '" class="material-icons">clear</i></div></li>'; //    $('.selectCardCss').css("display", "block");

  $("#cart2").append(addCart);
  $("#stayingHoursNo" + spot.no).change(function () {
    recalculateSumOfSpotStayingMins();
  });
  $("#stayingMinutesNo" + spot.no).change(function () {
    recalculateSumOfSpotStayingMins();
  });

  function recalculateSumOfSpotStayingMins() {
    if ($("#stayingHoursNo" + spot.no).val() == 0 && $("#stayingMinutesNo" + spot.no).val() == 0) {
      $("#stayingMinutesNo" + spot.no).val(1);
    }

    sumOfSpotStayingMins = 0;

    for (var i = 0; i < selectedSpots.length; i++) {
      var no = selectedSpots[i].no;
      sumOfSpotStayingMins += Number($("#stayingHoursNo" + no).val()) * 60 + Number($("#stayingMinutesNo" + no).val());
    }

    var sumOfSpotStayingH = Math.floor(sumOfSpotStayingMins / 60);
    var sumOfSpotStayingM = Math.floor(sumOfSpotStayingMins % 60);
    $("#sumOfSpotStayingH").html(sumOfSpotStayingH);
    $("#sumOfSpotStayingM").html(sumOfSpotStayingM);
  }

  w3_open();

  if ($(window).width() > 600) {
    $("#searchSpotOrHotelKeyword").val("");
    $("#searchSpotOrHotelKeyword").focus();
  }
} //장바구니에서 장소 제거


function removeSpotFromSelectedSpots(no) {
  for (var i = 0; i < selectedSpots.length; i++) {
    if (selectedSpots[i].no == no) {
      selectedSpots.splice(i, 1);
      sumOfSpotStayingMins -= Number($("#stayingHoursNo" + no).val()) * 60 + Number($("#stayingMinutesNo" + no).val());
      var sumOfSpotStayingH = Math.floor(sumOfSpotStayingMins / 60);
      var sumOfSpotStayingM = Math.floor(sumOfSpotStayingMins % 60);
      $("#sumOfSpotStayingH").html(sumOfSpotStayingH);
      $("#sumOfSpotStayingM").html(sumOfSpotStayingM);
      continue;
    }
  }

  for (var _i6 = 0; _i6 < markers.length; _i6++) {
    if (markers[_i6].spotNo == no) {
      markers[_i6].setMap(null);

      markers.splice(_i6, 1);
      _i6--;
    }
  } //html 요소 제거 로직 추가


  $("#cartNo" + no).remove();
  refreshSeletedSpotsCnt();
  addUserTrackingData('removeSpotFromSelectedSpots|' + no);
} //장바구니에서 호텔 제거


function removeSelectedHotel(hotelChekedDay) {
  if (hotelMarkers[hotelChekedDay] && hotelMarkers[hotelChekedDay].setMap) hotelMarkers[hotelChekedDay].setMap(null);
  $("#hotelCartDay" + hotelChekedDay).remove();
  $("#hotelSetDayLabel" + [hotelChekedDay + 1]).remove(); // 셀렉트호텔 데이표시 라벨제거(LSH)

  selectedHotels[hotelChekedDay] = null;
  $("#day" + hotelChekedDay + "hotelInfo").css("display", "block");
  $('input[name="hotelDay"]')[hotelChekedDay].checked = true;
  $('input[name="hotelDay"]')[hotelChekedDay].focus();
  refreshSeletedHotelsCnt();
  addUserTrackingData('removeSelectedHotel|' + hotelChekedDay);
} //장바구니에서 장소 모두 제거 & 전체삭제


function removeAllSpotFromSelectedSpots() {
  for (var i = 0; i < selectedSpots.length; i++) {
    $("#cartNo" + selectedSpots[i].no).remove();
  }

  selectedSpots = [];

  for (var _i7 = 0; _i7 < markers.length; _i7++) {
    markers[_i7].setMap(null);
  }

  markers = [];
  refreshSeletedSpotsCnt();
  sumOfSpotStayingMins = 0;
  $("#sumOfSpotStayingH").html(0);
  $("#sumOfSpotStayingM").html(0); //    $('.selectCardCss').css("display", "");

  addUserTrackingData('removeAllSpotFromSelectedSpots');
} //장바구니에서 호텔 모두 제거 & 전체삭제


function removeAllHotelsSelectedSpots() {
  for (var i = 0; i < selectedHotels.length; i++) {
    removeSelectedHotel(i);
  }

  selectedHotels = [];
} //일정생성


function makeRoute() {
  var gestureHandlingType = 'cooperative';

  if ($(window).width() > 600) {
    gestureHandlingType = '';
  }

  map2 = new google.maps.Map(document.getElementById('googleMapForRoute'), {
    zoom: 11,
    center: {
      lat: startLat,
      lng: startLng
    },
    gestureHandling: gestureHandlingType
  });
  var reqParam = {};
  var reqData = {};

  for (var i = 0; i < selectedSpots.length; i++) {
    var _spot3 = selectedSpots[i];
    _spot3.realStaySec = $("#stayingHoursNo" + _spot3.no).val() * 3600 + $("#stayingMinutesNo" + _spot3.no).val() * 60;
  }

  var daySchedule = [];
  var dailyStartTimes = $('input[name="dailyStartTimes"]');
  var dailyEndTimes = $('input[name="dailyEndTimes"]');
  var weekDay = startTravelDate.getDay();

  for (var _i8 = 0; _i8 < travelDay; _i8++) {
    var startTime = dailyStartTimes[_i8].value.replace(":", "");

    var endTime = dailyEndTimes[_i8].value.replace(":", "");

    var schedule = {
      weekDay: weekDay,
      startTime: startTime,
      endTime: endTime,
      whatDay: _i8,
      complete: false,
      oneSpotDay: false
    };
    daySchedule.push(schedule);
    weekDay++;

    if (weekDay == 7) {
      weekDay = 0;
    }
  }

  reqParam.daySchedule = daySchedule;
  reqParam.transportationMode = transportationMode;
  reqParam.cityName = cityName;
  reqParam.spots = selectedSpots;

  for (var _i9 = 0; _i9 < reqParam.spots.length; _i9++) {
    var _spot4 = reqParam.spots[_i9];

    if (_typeof(_spot4.openTime) == "object") {
      _spot4.openTime = JSON.stringify(_spot4.openTime);
    }
  }

  for (var _i10 = 0; _i10 < travelDay; _i10++) {
    if (!selectedHotels[_i10]) {
      showToastMsg(i18nSvc.get('youShouldSelectHotel'));
      $("[name=searchSpotOrHotelRadio]")[0].checked = true;
      $("#searchSpotOrHotelKeyword").focus();
      $(".search-sidebar").addClass("heartbeat");
      setTimeout(function () {
        $(".search-sidebar").removeClass("heartbeat");
      }, 2500);
      return;
    }
  }

  reqParam.hotels = selectedHotels;
  reqParam.travelDay = $('#travelDay').val();

  if (reqParam.spots.length < reqParam.travelDay) {
    showToastMsg(i18nSvc.get('travelDayShouldBeGreaterThanSelectedPlaces'));
    $("[name=searchSpotOrHotelRadio]")[1].checked = true;
    $("#searchSpotOrHotelKeyword").focus();
    $(".search-sidebar").addClass("heartbeat");
    setTimeout(function () {
      $(".search-sidebar").removeClass("heartbeat");
    }, 2500);
    return;
  }

  if (totalTravelMins < sumOfSpotStayingMins) {
    showToastMsg(i18nSvc.get('sumOfStayingTimeOfPlacesCannotBeGreaterThanTotalTravelTime'));
    $("#totalTravelTimeArea").addClass("blink-2");
    $("#totalSpendingTimeArea").addClass("blink-2");
    setTimeout(function () {
      $("#totalTravelTimeArea").removeClass("blink-2");
      $("#totalSpendingTimeArea").removeClass("blink-2");
    }, 3000);
    return;
  }

  reqData.data = JSON.stringify(reqParam);
  w3_SSclose();
  $("#searchSpotKeywordAfterMakeRoute").val("");
  $("#spotsListAfterMakeRoute").html("");
  closePlanSideBar();
  modifyModeDeActivate();
  openPlanPageWidely = false;
  getRouteAndSetMap(reqData);
  addUserTrackingData('makeRoute');
} //수정저장


function remakeRoute(fromOther) {
  backupDataFromServer = JSON.parse(JSON.stringify(dataFromServer));
  setMap(dataFromServer);
  showToastMsg(i18nSvc.get('planModifed'));
  setMsidebar2AsItIs();

  if (directionsDisplay) {
    directionsDisplay.setMap(null);
  } // if (socket && !fromOther) {
  //     socket.emit('remakeRoute', {
  //         savedRouteToken: savedRouteToken
  //     });
  // }


  modifyModeDeActivate();
  addUserTrackingData('remakeRoute');
} //수정취소


function restoreRoute(fromOther) {
  dataFromServer = JSON.parse(JSON.stringify(backupDataFromServer));
  setMap(dataFromServer);
  showToastMsg(i18nSvc.get('planModificationCanceld'));
  setMsidebar2AsItIs(); // if (socket && !fromOther) {
  //     socket.emit('restoreRoute', {
  //         savedRouteToken: savedRouteToken
  //     });
  // }

  modifyModeDeActivate();
  addUserTrackingData('restoreRoute');
} //일정생성 후 새 지도창에 일정 출력


function setMap(data) {
  var tabIdx = 1;
  $('#remakeAndRestoreButtonArea').css("display", "");
  $('#allDayDetailScheduleExpDiv').css("display", "");
  $('#msidebar2changeButton').css("display", "");
  $("#whatDayForDetail").html("");
  $("#dayListButtonArea").html("");
  $("#dailyRoute").html("");
  $("#dailyRoute").css("display", "");
  $('#allDayDetailScheduleDiv').html("");
  deleteAllMarkerOnRouteMap();
  spotsByDay = data.spotsByDay;
  stayingInfos = data.stayingInfos;

  var _loop = function _loop(i) {
    var stayingInfo = stayingInfos[i];
    var dayStartTimeMin = void 0,
        dayStartTimeHHMM = void 0,
        dayShowingStartTime = void 0,
        weekDay = void 0,
        month = void 0,
        day = void 0;
    var appendText = void 0;
    var today = new Date(startTravelDate);
    today.setDate(startTravelDate.getDate() + i - 1);

    if (i == 0) {} else if (spotsByDay[i].length == 1) {
      dayShowingStartTime = "00:00";
      weekDay = today.getDay() % 7;
      month = today.getMonth() + 1;
      day = today.getDate();
    } else {
      dayStartTimeMin = stayingInfo[0].start - stayingInfo[0].fromPrevious;
      dayStartTimeHHMM = getHHMMFromAbsoluteMinute(dayStartTimeMin);
      dayShowingStartTime = dayStartTimeHHMM.substr(0, 2) + ":" + dayStartTimeHHMM.substr(2, 4);
      weekDay = today.getDay() % 7;
      month = today.getMonth() + 1;
      day = today.getDate();
    }

    if (i == 0) {
      appendText = '<div class="omissionPlaceDiv z-depth-3" id="omittedPlaces"><h7><b>' + i18nSvc.get('notIncludedPlaces') + '</b><i id="omissionPlaceMi" class="material-icons">code</i><br><div id="omissionPlaceText"><hs>' + i18nSvc.get('placesOutOfPlanIsHere') + '<br>' + i18nSvc.get('youCanDragYourPlacesHere') + '<br>' + i18nSvc.get('dragPlacesAndMoveToWhereYouWant') + '</hs></div></h7>' + '<div class="dailyRouteDetailSummery" id="dailyRouteDetailSummery0">' + '<div class="dailyRouteDetailSummeryFirstDiv" style="max-height:80vh;overflow-y:auto;overflow-x:hidden;" id="dailySpotsToEdit' + i + '">';
    } else {
      setMarkerOnRouteMap(spotsByDay[i][0], 'hotel');
      appendText = '<div class="addsdsmall"><div class="input-field" style="margin:5px;"><select id="day' + i + 'SelectBox" style="height:auto;display:inline-block;width:auto;">'; // '<div class="s-border addsdsmall" style=""><div><h7><b>' + (i) + '일차 ' + month + '월 ' + day + '일 ' + weekDayKor[weekDay] + '요일</b></h7>' +
      // '<div class="dailyRouteDetailSummery" id="dailyRouteDetailSummery' + i + '">' +
      //일자 통째로 변경 부분

      for (var j = 1; j < spotsByDay.length; j++) {
        var todayForSelectBox = new Date(startTravelDate);
        todayForSelectBox.setDate(startTravelDate.getDate() + j - 1);
        var weekDayForSelectBox = todayForSelectBox.getDay() % 7;
        var monthForSelectBox = todayForSelectBox.getMonth() + 1;
        var dayForSelectBox = todayForSelectBox.getDate();

        if (i == j) {
          appendText += "<option value=\"".concat(j, "\" selected><h7><b>").concat(j).concat(i18nSvc.get('day'), " ").concat(i18nSvc.get('monthList')[monthForSelectBox], " ").concat(dayForSelectBox).concat(i18nSvc.get('whatDay'), " ").concat(i18nSvc.get('weekDays')[weekDayForSelectBox], "</b></h7></option>");
        } else {
          appendText += "<option value=\"".concat(j, "\"><h7><b>").concat(j).concat(i18nSvc.get('day'), " ").concat(i18nSvc.get('monthList')[monthForSelectBox], " ").concat(dayForSelectBox).concat(i18nSvc.get('whatDay'), " ").concat(i18nSvc.get('weekDays')[weekDayForSelectBox], "</b></h7></option>");
        }
      }

      appendText += "</select></div>" + '<div class="dailyRouteGuideText"><hs>' + i18nSvc.get('canChangeDay') + '</hs></div>' + '<div class="dailyRouteDetailSummery" id="dailyRouteDetailSummery' + i + '">' + '<i class="material-icons" style="color:' + colors[i - 1] + ';font-size: 18px;vertical-align:-3px;">place</i><span id="howMuchDays' + i + '">' + (spotsByDay[i].length - 1) + '</span>  ' + i18nSvc.get('spot') + (spotsByDay[i].length > 2 && lang == 'en' ? 's' : '') + '&nbsp;' + '<div id="noToEdit' + spotsByDay[i][0].no + '" class="card s-border modalspotdivCss" style="margin-bottom:10px!important;">' + '<div class="center spotStaySFtextH"><hs>' + i18nSvc.get('hotel') + '</hs></div>' + '<div class="placecardHstyle">' + '<div class="hotelImgCss"><img src="' + headAddress + '/getSpotImage/' + cityName + '?no=' + spotsByDay[i][0].no + '" alt="Image"></div>' + '<div class="placecardtextstyle hotelTextCss" style="text-align: left;"><h7 class="modalDDdiv" title="' + spotsByDay[i][0].showingName + '">' + spotsByDay[i][0].showingName + '</h7><hs>' + i18nSvc.get('start') + '&nbsp;</hs><input id="dayShowingStartTime' + +i + '" class="center dayShowingStartTimeInput" type="time" value="' + dayShowingStartTime + '" tabindex="' + tabIdx + '"></div></div></div><hr class="hr2">' + '<div class="dailyRouteDetailSummeryFirstDiv" id="dailySpotsToEdit' + i + '">';
      tabIdx++;
    }

    for (var _j = 1; _j < spotsByDay[i].length; _j++) {
      var _spot5 = spotsByDay[i][_j]; //모바일에서는 포함되지 않은 장소들 정보 안보내게 해놨음... 그래서 그냥 임시로......하................

      if (i == 0) {
        stayingInfo[_j - 1] = {
          start: "0000",
          finish: "0000",
          fromPrevious: "0000"
        };
      }

      var spotStayingInfo = stayingInfo[_j - 1]; //let spotStayingMinutes = spotStayingInfo.finish - spotStayingInfo.start;

      var spotStayingMinutes = Math.floor(_spot5.realStaySec / 60);

      while (spotStayingMinutes < 0) {
        spotStayingMinutes += 1440;
      }

      var spotStayingH = Math.floor(spotStayingMinutes / 60);
      var spotStayingM = Math.floor(spotStayingMinutes % 60);
      var spotStayingStart = getHHMMFromAbsoluteMinute(spotStayingInfo.start).substr(0, 2) + ":" + getHHMMFromAbsoluteMinute(spotStayingInfo.start).substr(2, 4);
      var spotStayingFinish = getHHMMFromAbsoluteMinute(spotStayingInfo.finish).substr(0, 2) + ":" + getHHMMFromAbsoluteMinute(spotStayingInfo.finish).substr(2, 4);
      var openTime = _spot5.openTime;
      var openTimeAppendText = "";

      if (openTime.length == 0 || openTime[0] == "24/7") {
        for (var k = 0; k < 7; k++) {
          openTimeAppendText += '<li>' + weekDayKor[k] + ' : 00:00 ~ 24:00</li>';
        }
      } else {
        var openTimeByDay = [];

        for (var _k = 0; _k < 7; _k++) {
          openTimeByDay[_k] = [];
        }

        for (var _k2 = 0; _k2 < openTime.length; _k2++) {
          var time = openTime[_k2];
          openTimeByDay[time.o[0]].push(time);
        }

        for (var _k3 = 0; _k3 < 7; _k3++) {
          openTimeAppendText += '<li>' + weekDayKor[_k3] + ' : ';

          if (openTimeByDay[_k3].length > 0) {
            for (var l = 0; l < openTimeByDay[_k3].length; l++) {
              var openTimeH = openTimeByDay[_k3][l].o[1].substr(0, 2);

              var openTimeM = openTimeByDay[_k3][l].o[1].substr(2, 4);

              var closeTimeH = openTimeByDay[_k3][l].c[1].substr(0, 2);

              var closeTimeM = openTimeByDay[_k3][l].c[1].substr(2, 4);

              if (l > 0) {
                openTimeAppendText += "<span style='visibility:hidden '>햫 : </span>";
              }

              openTimeAppendText += openTimeH + ":" + openTimeM + " ~ " + closeTimeH + ":" + closeTimeM + "<br>";
            }
          } else {
            openTimeAppendText += i18nSvc.get('closed');
          }

          '</li>';
        }
      }

      setMarkerOnRouteMapWithNumber(_spot5, i + "");
      var bookmark = "",
          titleForPlaceType = void 0,
          backgroundColor = void 0;

      if (_spot5.isSpot == 0) {
        bookmark = "restaurant";
        backgroundColor = "#ff4081";
        titleForPlaceType = i18nSvc.get('restaurant');
      } else if (_spot5.isSpot == 1) {
        bookmark = "account_balance";
        titleForPlaceType = i18nSvc.get('spot');
      }

      var durationHtml = "";

      if (i != 0) {
        durationHtml = "<div class=\"durationDiv\"><i title=\"' + i18nSvc.get('duration') + '\" class=\"material-icons\">more_vert</i><hs>".concat(dataFromServer.stayingInfos[i][_j - 1].fromPrevious).concat(i18nSvc.get('min'), "</hs></div>");
      }

      appendText += '<div>' + durationHtml + '<div id="noToEdit' + _spot5.no + '" class="s-border card z-depth-2 modalspotdivCss">' + '<div class="s-border-bottom center spotStaySFtext"><hs>' + i18nSvc.get('start') + '&nbsp;</hs><input readonly id="spotStayingStart' + _spot5.no + '" class="center spotStaySFinput" type="time" value="' + spotStayingStart + '"></div>' + '<div class="placecardHstyle"><div>' + '<div class="placecardbookmark_AMR" style="top:26px;background-color:' + backgroundColor + '"><i title="' + titleForPlaceType + '"class="material-icons placecardbookmark_mi_AMR">' + bookmark + '</i></div>' + '<img src="' + headAddress + '/getSpotImage/' + cityName + '?no=' + _spot5.no + '" alt="Image"></div>' + '<div class="placecardtextstyle"><h7 class="modalDDdiv" title="' + _spot5.showingName + '">' + _spot5.showingName + '</h7><div class="modalspotstayinput"><i title="' + i18nSvc.get('stayingTime') + '" class="material-icons">timer</i>&nbsp&nbsp' + '<input id="spotStayingH' + _spot5.no + '" type="number" min="0" max="24" value="' + spotStayingH + '" step="1" tabindex="' + tabIdx + '">' + i18nSvc.get('hours') + '&nbsp&nbsp' + '<input id="spotStayingM' + _spot5.no + '" type="number" value="' + spotStayingM + '" size="1" maxlength="2" min="0" max="59" tabindex="' + (tabIdx + 1) + '">' + i18nSvc.get('min') + '</div></div></div>' + '<div class="s-border-top center spotStaySFtext">' + // '<div title="상품검색" class="btn travelPackagebtncss" onclick="searchInWeb(\'myrealtrip\', \'' + korCityName + '&nbsp' + spot.showingName.split("(")[0] + '\', \'' + spot.lat + '\', \'' + spot.lng + '\')" >상품보기</div>' +
      '<hs>' + i18nSvc.get('end') + '&nbsp;</hs><input readonly id="spotStayingFinish' + _spot5.no + '" class="center spotStaySFinput" type="time" value="' + spotStayingFinish + '"></div>' + '<div class="w3-dropdown-hover modalspotLTiconDiv"><i title="' + i18nSvc.get('timeTable') + '" id="timeTableIcon' + _spot5.no + '" class="material-icons darkgray-text modalspotLTicon">event_note</i>' + '<div class="scale-in-tl w3-dropdown-content">' + '<ul style="width:100%" class="container padding-816" id="openTimes' + _spot5.no + '"><b>' + i18nSvc.get('openHours') + '</b>' + openTimeAppendText + '</ul></div></div>' + //메모장 시작 (LSH) 아래 display:none 해제시 메모기능 가능
      '<div id="SpotMemoOpen' + _spot5.no + '" class="openSpotMemobtnDiv" onclick="showSpotMemoDiv(' + _spot5.no + ')"><div  class="btn openSpotMemobtn">memo</div></div>' + '<i id="sortableHandleicon" title="' + i18nSvc.get('clickAndDrag') + '" class="w3-display-right material-icons darkgray-text modalspotRTicon SHicon">import_export</i>' + '<i title="' + i18nSvc.get('removeFromSelectedList') + '" class="w3-display-right material-icons darkgray-text modalspotRTicon" style="cursor:pointer!important;" id="deleteForEditScheduleButton' + _spot5.no + '">delete_forever</i>' + '<div id="SpotMemoDiv' + _spot5.no + '" class="SpotMemoDiv s-border"><textarea id="SpotMemoText' + _spot5.no + '" class="materialize-textarea mtcss" placeholder="' + i18nSvc.get('canPutShortMemo') + '">' + _spot5.memo + '</textarea><div id="closeSpotMemobtnDiv' + _spot5.no + '" class="closeSpotMemobtnDiv"><div onclick="closeSpotMemoDiv(' + _spot5.no + ')" class="btn closeSpotMemobtn">close</div></div></div></div></div>'; //메모장 끝 (LSH)

      tabIdx += 2;
    }

    $('#allDayDetailScheduleDiv').append(appendText);
    $(".omissionPlaceDiv .spotStaySFinput").val(""); //selectBox로 통째로 바꿀때

    $("#day" + i + "SelectBox").change(
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var changingDayIdx, targetDayidx, temp, _j2, _j3;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(i != Number($("#day" + i + "SelectBox").val()))) {
                _context.next = 25;
                break;
              }

              changingDayIdx = i;
              targetDayidx = Number($("#day" + i + "SelectBox").val()); //나중에 소켓으로 연동해야함

              temp = dataFromServer.spotsByDay[changingDayIdx];
              dataFromServer.spotsByDay[changingDayIdx] = dataFromServer.spotsByDay[targetDayidx];
              dataFromServer.spotsByDay[targetDayidx] = temp;
              temp = dataFromServer.stayingInfos[changingDayIdx];
              dataFromServer.stayingInfos[changingDayIdx] = dataFromServer.stayingInfos[targetDayidx];
              dataFromServer.stayingInfos[targetDayidx] = temp;
              temp = dataFromServer.spotsByDay[changingDayIdx][0];
              dataFromServer.spotsByDay[changingDayIdx][0] = dataFromServer.spotsByDay[targetDayidx][0];
              dataFromServer.spotsByDay[targetDayidx][0] = temp;

              for (_j2 = 0; _j2 < dataFromServer.spotsByDay[targetDayidx].length; _j2++) {
                dataFromServer.spotsByDay[targetDayidx][_j2].whatDay = targetDayidx;
              }

              for (_j3 = 0; _j3 < dataFromServer.spotsByDay[changingDayIdx].length; _j3++) {
                dataFromServer.spotsByDay[changingDayIdx][_j3].whatDay = changingDayIdx;
              }

              if (!(dataFromServer.spotsByDay[changingDayIdx].length > 1)) {
                _context.next = 18;
                break;
              }

              _context.next = 17;
              return getDurationBetweenSpotsWithNo(dataFromServer.spotsByDay[changingDayIdx][0].no, dataFromServer.spotsByDay[changingDayIdx][1].no);

            case 17:
              dataFromServer.stayingInfos[changingDayIdx][0].fromPrevious = _context.sent;

            case 18:
              if (!(dataFromServer.spotsByDay[targetDayidx].length > 1)) {
                _context.next = 22;
                break;
              }

              _context.next = 21;
              return getDurationBetweenSpotsWithNo(dataFromServer.spotsByDay[targetDayidx][0].no, dataFromServer.spotsByDay[targetDayidx][1].no);

            case 21:
              dataFromServer.stayingInfos[targetDayidx][0].fromPrevious = _context.sent;

            case 22:
              setMap(dataFromServer);
              setMsidebar2AsItIs();
              modifyModeActivate();

            case 25:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    })));

    if (i == 0 && spotsByDay[0].length > 1) {
      $('#timeTableIcon' + spotsByDay[0][spotsByDay[0].length - 1].no).hover(function () {
        //호버될때
        setTimeout(function () {
          $(".w3-dropdown-content").css("position", "fixed");
        }, 10);
      }, function () {
        //호버빠질때
        $(".w3-dropdown-content").css("position", "absolute");
      });
      $('#openTimes' + spotsByDay[0][spotsByDay[0].length - 1].no).hover(function () {
        //호버될때
        setTimeout(function () {
          $(".w3-dropdown-content").css("position", "fixed");
        }, 10);
      }, function () {
        //호버빠질때
        $(".w3-dropdown-content").css("position", "absolute");
      });
    }

    $("#omittedPlaces").draggable({
      containment: "window"
    });
    $('#omittedPlaces').draggable({
      cancel: "#dailyRouteDetailSummery0"
    });
    $("#toastToRegisterSpots").css("display", "none");

    if (i != 0) {
      var _loop2 = function _loop2(_j4) {
        // visitInfo = {visitDay: (요일), visitTime: (방문시간, HHMM), staySec: (체류시간)}
        var spot = spotsByDay[i][_j4];
        var spotStayingInfo = stayingInfo[_j4 - 1];
        var spotStayingStart = getHHMMFromAbsoluteMinute(spotStayingInfo.start).substr(0, 2) + getHHMMFromAbsoluteMinute(spotStayingInfo.start).substr(2, 4);
        var visitDay = (startTravelDate.getDay() + i - 1) % 7;
        var visitTime = spotStayingStart;
        var staySec = Number($("#spotStayingH" + spot.no).val()) * 3600 + Number($("#spotStayingM" + spot.no).val()) * 60;
        $("#toastToRegisterSpots").css("display", "none");

        if (!checkTimeIfAvailable(spot, {
          visitDay: visitDay,
          visitTime: visitTime,
          staySec: staySec
        })) {
          $("#timeTableIcon" + spot.no).css("color", "#FF0000");
          $("#timeTableIcon" + spot.no).addClass("heartbeat");
          $("#openTimes" + spot.no + " li").each(function (index, element) {
            if (index == visitDay) {
              $(this).css({
                color: "#FF0000"
              });
            } else {
              $(this).css({
                color: "#ffffff"
              });
            }
          });
          showToastMsg(i18nSvc.get('scheduleProblem'));
        } else {
          $("#openTimes" + spot.no + " li").each(function (index, element) {
            if (index == visitDay) {
              $(this).css({
                color: "#FFFF00"
              });
            } else {
              $(this).css({
                color: "#ffffff"
              });
            }
          });
          $("#timeTableIcon" + spot.no).css("color", "#37474f");
          $("#timeTableIcon" + spot.no).removeClass("heartbeat");
        }
      };

      //rewnewalDailyTimes하고 나서 다시 setMap 호출하기 때문에 요일 & 시간 안맞는거 원복됨. 다시해주기.
      for (var _j4 = 1; _j4 < spotsByDay[i].length; _j4++) {
        _loop2(_j4);
      }
    } //호텔 출발시간 변경


    $("#dayShowingStartTime" + i).change(function () {
      changeHotelDepartTime(i, $("#dayShowingStartTime" + i).val(), false);
    });

    var _loop3 = function _loop3(_j5) {
      var spot = spotsByDay[i][_j5]; //카드 클릭시 마커 바운스

      $("#noToEdit" + spot.no).click(function () {
        var _loop5 = function _loop5(_k4) {
          if (markersOnRouteMap[_k4].spotNo == spot.no) {
            markersOnRouteMap[_k4].setAnimation(google.maps.Animation.BOUNCE);

            setTimeout(function () {
              markersOnRouteMap[_k4].setAnimation();
            }, 1500);
          }
        };

        for (var _k4 = 0; _k4 < markersOnRouteMap.length; _k4++) {
          _loop5(_k4);
        }
      }); //머무는 시간 변경

      $("#spotStayingH" + spot.no).change(function () {
        changeSpotStayingH(spot, i, _j5, $("#spotStayingH" + spot.no).val(), false);
        addUserTrackingData('changeSpotStayingH|' + spot.no + '|' + $("#spotStayingH" + spot.no).val() + ':' + $("#spotStayingM" + spot.no).val());
      });
      $("#spotStayingM" + spot.no).change(function () {
        changeSpotStayingM(spot, i, _j5, $("#spotStayingM" + spot.no).val(), false);
        addUserTrackingData('changeSpotStayingM|' + spot.no + '|' + $("#spotStayingH" + spot.no).val() + ':' + $("#spotStayingM" + spot.no).val());
      }); //메모 바뀔때

      $("#SpotMemoText" + spot.no).on("change keyup paste", function () {
        if ($(this).val().length > 100) {
          $(this).val($(this).val().substr(0, 100));
        }

        var memo = $(this).val();
        changeSpotMemo(spot, memo);
      });
    };

    for (var _j5 = 1; _j5 < spotsByDay[i].length; _j5++) {
      _loop3(_j5);
    } //장소 삭제


    var _loop4 = function _loop4(_j6) {
      var spot = spotsByDay[i][_j6];
      $('#deleteForEditScheduleButton' + spot.no).click(function () {
        var deleteFlag = confirm(i18nSvc.get('sureToRemove'));

        if (!deleteFlag) {
          return;
        } // if (spotsByDay[i].length == 2 && i != 0) {
        //     showToastMsg(i18nSvc.get('atLeastOnePlace'));
        //     return;
        // }


        deleteSpotFromPlan(spot, i, _j6, false);
        addUserTrackingData('deleteSpotFromPlan|' + spot.no);
      });
    };

    for (var _j6 = 1; _j6 < spotsByDay[i].length; _j6++) {
      _loop4(_j6);
    }

    Sortable.create($("#dailySpotsToEdit" + i)[0], {
      handle: '#sortableHandleicon',
      group: {
        name: "dailySchedule",
        pull: true,
        put: true
      },
      //어쨌든 옮길때 장소 하나뿐이면 취소
      onMove: function onMove(
      /**Event*/
      evt,
      /**Event*/
      originalEvent) {
        var from = evt.from.id.charAt(evt.from.id.length - 1);
        var to = evt.to.id.charAt(evt.to.id.length - 1); //미포함 장소로 이동
        // if (to == 0) {
        //     return false;
        // }
        // if (spotsByDay[from].length == 2 && from != 0) {
        // showToastMsg("하루에 최소한 한개의 일정이 필요합니다.");
        // return false;
        // }
      },
      //다른 리스트로 옮길때
      onAdd: function onAdd(
      /**Event*/
      evt) {
        //console.log("onAdd", evt);
        var from = evt.from.id.charAt(evt.from.id.length - 1);
        var fromIdx = evt.oldIndex;
        var to = evt.to.id.charAt(evt.to.id.length - 1);
        var toIdx = evt.newIndex; // if (spotsByDay[from].length == 2 && from != 0) {
        //     return false;
        // }
        //미포함 장소로 이동
        // if (to == 0) {
        //     return false;
        // }

        moveSpotToOtherDay(from, fromIdx, to, toIdx, false);
        addUserTrackingData('moveSpotToOtherDay|' + from + '|' + fromIdx + '|' + to + '|' + toIdx);
      },
      //리스트 안에서 옮길때
      onUpdate: function onUpdate(
      /**Event*/
      evt) {
        var fromIdx = evt.oldIndex;
        var toIdx = evt.newIndex;
        var dayIdx = evt.to.id.charAt(evt.to.id.length - 1);
        moveSpotInSameDay(dayIdx, toIdx, fromIdx, false);
        addUserTrackingData('moveSpotInSameDay|' + dayIdx + '|' + fromIdx + '|' + toIdx);
      }
    });
  };

  for (var i = 0; i < spotsByDay.length; i++) {
    _loop(i);
  }

  map2.panTo({
    lat: data.spotsByDay[0][0].lat,
    lng: data.spotsByDay[0][0].lng
  });
  drawAllFlightPath();
  $("#dayListButtonArea").html("");

  for (var i = 1; i < spotsByDay.length; i++) {
    var dayListButtonAppendHtml = '<div onclick="openDayDetailPlan(' + i + ')">' + '<div id="dayButton' + i + '" class="btn-floating btn-large daybutton z-depth-2" style="color: #000000;"><h7>' + i + i18nSvc.get('day') + '</h7></div>' + '</div>';
    $("#dayListButtonArea").append(dayListButtonAppendHtml);
  }

  $("#travelDayForRouteMap").html($("#travelDay").val());
  $("#dailyRoute").html("");
  $("#dailyRoute").css("display", "none");
  $('#allDayDetailScheduleDiv').css("display", "");
} //일자별 호텔 출발시간(하루 시작시간) 변경


function changeHotelDepartTime(i, value, fromOther) {
  // if (socket && !fromOther) {
  //     socket.emit('changeHotelDepartTime', {
  //         i: i,
  //         value: value,
  //         savedRouteToken: savedRouteToken
  //     });
  // } else {
  //     $("#dayShowingStartTime" + i).val(value);
  // }
  rewnewalDailyTimes(0, i);
  modifyModeActivate();
} //장소별 머무는 시간(시간만) 변경


function changeSpotStayingH(spot, i, j, value, fromOther) {
  // if (socket && !fromOther) {
  //     socket.emit('changeSpotStayingH', {
  //         spot: spot,
  //         i: i,
  //         j: j,
  //         value: value,
  //         savedRouteToken: savedRouteToken
  //     });
  // } else {
  //     $("#spotStayingH" + spot.no).val(value);
  // }
  if ($("#spotStayingH" + spot.no).val() > 23) {
    $("#spotStayingH" + spot.no).val(23);
  }

  spot.realStaySec = Number($("#spotStayingH" + spot.no).val()) * 3600 + Number($("#spotStayingM" + spot.no).val()) * 60;
  rewnewalDailyTimes(j - 1, i);
  modifyModeActivate();
} //장소별 머무는 시간(분만) 변경


function changeSpotStayingM(spot, i, j, value, fromOther) {
  // if (socket && !fromOther) {
  //     socket.emit('changeSpotStayingM', {
  //         spot: spot,
  //         i: i,
  //         j: j,
  //         value: value,
  //         savedRouteToken: savedRouteToken
  //     });
  // } else {
  //     $("#spotStayingM" + spot.no).val(value);
  //
  // }
  if ($("#spotStayingM" + spot.no).val() > 59) {
    $("#spotStayingM" + spot.no).val(59);
  }

  spot.realStaySec = Number($("#spotStayingH" + spot.no).val()) * 3600 + Number($("#spotStayingM" + spot.no).val()) * 60;
  rewnewalDailyTimes(j - 1, i);
  modifyModeActivate();
} //장소별 메모 변경


function changeSpotMemo(spot, memo) {
  //나중에 소켓부분
  spot.memo = memo;
  modifyModeActivate();
}

; //일정에서 장소삭제

function deleteSpotFromPlan(_x, _x2, _x3, _x4) {
  return _deleteSpotFromPlan.apply(this, arguments);
} //일정에서 장소를 다른 날로 이동


function _deleteSpotFromPlan() {
  _deleteSpotFromPlan = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(spot, i, j, fromOther) {
    var doRestForRemoveAwait;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            doRestForRemoveAwait = function _ref2() {
              stayingInfos[i].splice([j - 1], 1);
              spotsByDay[i].splice(j, 1);
              $('#noToEdit' + spot.no).remove();
              $("#howMuchDays" + i).html(Number($("#howMuchDays" + i).html()) - 1);
              rewnewalDailyTimes(j - 1, i);
              setMap(dataFromServer);
              setMsidebar2AsItIs();
            };

            if (!(spotsByDay[i][j + 1] && i != 0)) {
              _context2.next = 5;
              break;
            }

            _context2.next = 4;
            return getDurationBetweenSpotsWithNo(spotsByDay[i][j - 1].no, spotsByDay[i][j + 1].no);

          case 4:
            stayingInfos[i][j].fromPrevious = _context2.sent;

          case 5:
            doRestForRemoveAwait();
            modifyModeActivate();

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _deleteSpotFromPlan.apply(this, arguments);
}

function moveSpotToOtherDay(_x5, _x6, _x7, _x8, _x9) {
  return _moveSpotToOtherDay.apply(this, arguments);
} //일정에서 장소를 같은 날짜 안에서 순서변경


function _moveSpotToOtherDay() {
  _moveSpotToOtherDay = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(from, fromIdx, to, toIdx, fromOther) {
    var doRestForRemoveAwait;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            doRestForRemoveAwait = function _ref3() {
              if (from != 0) {
                rewnewalDailyTimes(fromIdx, from);
              }

              rewnewalDailyTimes(toIdx, to);
              $("#howMuchDays" + from).html(Number($("#howMuchDays" + from).html()) - 1);
              $("#howMuchDays" + to).html(Number($("#howMuchDays" + to).html()) + 1);
              setMap(dataFromServer);
              setMsidebar2AsItIs();
            };

            // if (socket && !fromOther) {
            //     socket.emit('moveSpotToOtherDay', {
            //         from: from,
            //         fromIdx: fromIdx,
            //         to: to,
            //         toIdx: toIdx,
            //         savedRouteToken: savedRouteToken
            //     });
            // }
            // if (fromOther) {
            //
            //     let movingTarget = $("#dailySpotsToEdit" + from + ":nth-child(" + fromIdx + ")");
            //     let newParent = $("#dailySpotsToEdit" + to);
            //     if (newParent[0].childNodes.length < to) {
            //         newParent.appendChild(movingTarget);
            //     } else {
            //         newParent.insertBefore(movingTarget, newParent.children[to]);
            //     }
            // }
            spotsByDay[from][fromIdx + 1].whatDay = Number(to);
            stayingInfos[to].splice(toIdx, 0, stayingInfos[from].splice(fromIdx, 1)[0]);
            spotsByDay[to].splice(toIdx + 1, 0, spotsByDay[from].splice(fromIdx + 1, 1)[0]); //맨 끝에꺼 아니면

            if (!spotsByDay[from][fromIdx + 1]) {
              _context3.next = 8;
              break;
            }

            _context3.next = 7;
            return getDurationBetweenSpotsWithNo(spotsByDay[from][fromIdx].no, spotsByDay[from][fromIdx + 1].no);

          case 7:
            stayingInfos[from][fromIdx].fromPrevious = _context3.sent;

          case 8:
            if (!(to != 0)) {
              _context3.next = 16;
              break;
            }

            if (!spotsByDay[to][toIdx + 2]) {
              _context3.next = 13;
              break;
            }

            _context3.next = 12;
            return getDurationBetweenSpotsWithNo(spotsByDay[to][toIdx + 1].no, spotsByDay[to][toIdx + 2].no);

          case 12:
            stayingInfos[to][toIdx + 1].fromPrevious = _context3.sent;

          case 13:
            _context3.next = 15;
            return getDurationBetweenSpotsWithNo(spotsByDay[to][toIdx].no, spotsByDay[to][toIdx + 1].no);

          case 15:
            stayingInfos[to][toIdx].fromPrevious = _context3.sent;

          case 16:
            doRestForRemoveAwait();
            modifyModeActivate();

          case 18:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _moveSpotToOtherDay.apply(this, arguments);
}

function moveSpotInSameDay(_x10, _x11, _x12, _x13) {
  return _moveSpotInSameDay.apply(this, arguments);
} //바뀌기 시작한 부분,어느날이 바꼈는지 입력받아 바뀌기 시작한 부분부터 시간 다시 계산


function _moveSpotInSameDay() {
  _moveSpotInSameDay = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(dayIdx, toIdx, fromIdx, fromOther) {
    var movingTarget, newParent, i, doRestForRemoveAwait;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            doRestForRemoveAwait = function _ref4() {
              var changeStart = fromIdx;

              if (fromIdx > toIdx) {
                changeStart = toIdx;
              }

              rewnewalDailyTimes(changeStart, dayIdx);
              setMap(dataFromServer);
              setMsidebar2AsItIs();
            };

            // if (socket && !fromOther) {
            //     socket.emit('moveSpotInSameDay', {
            //         dayIdx: dayIdx,
            //         toIdx: toIdx,
            //         fromIdx: fromIdx,
            //         savedRouteToken: savedRouteToken
            //     });
            // }
            if (fromOther) {
              movingTarget = $("#dailySpotsToEdit" + dayIdx + ":nth-child(" + fromIdx + ")");
              newParent = $("#dailySpotsToEdit" + dayIdx);

              if (newParent[0].childNodes.length < toIdx) {
                newParent.appendChild(movingTarget);
              } else {
                newParent.insertBefore(movingTarget, newParent.children[toIdx]);
              }
            }

            stayingInfos[dayIdx].splice(toIdx, 0, stayingInfos[dayIdx].splice(fromIdx, 1)[0]);
            spotsByDay[dayIdx].splice(toIdx + 1, 0, spotsByDay[dayIdx].splice(fromIdx + 1, 1)[0]);

            if (!(dayIdx != 0)) {
              _context4.next = 13;
              break;
            }

            i = 0;

          case 6:
            if (!(i < spotsByDay[dayIdx].length - 1)) {
              _context4.next = 13;
              break;
            }

            _context4.next = 9;
            return getDurationBetweenSpotsWithNo(spotsByDay[dayIdx][i].no, spotsByDay[dayIdx][i + 1].no);

          case 9:
            stayingInfos[dayIdx][i].fromPrevious = _context4.sent;

          case 10:
            i++;
            _context4.next = 6;
            break;

          case 13:
            doRestForRemoveAwait();
            modifyModeActivate();

          case 15:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return _moveSpotInSameDay.apply(this, arguments);
}

function rewnewalDailyTimes(startIdx, whatdayIdx) {
  whatdayIdx = Number(whatdayIdx);

  var _loop6 = function _loop6(i) {
    if (whatdayIdx == 0) {
      return "break";
    }

    var newStartAbsoluteMin = void 0,
        newFinishAbsoluteMin = void 0;
    var stayingMin = Math.floor(spotsByDay[whatdayIdx][i + 1].realStaySec / 60); //stayingInfos[whatdayIdx][i].finish - stayingInfos[whatdayIdx][i].start;

    if (i == 0) {
      newStartAbsoluteMin = Number($("#dayShowingStartTime" + whatdayIdx).val().substr(0, 2) * 60) + Number($("#dayShowingStartTime" + whatdayIdx).val().substr(3, 5)) + stayingInfos[whatdayIdx][i].fromPrevious;
    } else {
      newStartAbsoluteMin = stayingInfos[whatdayIdx][i - 1].finish + stayingInfos[whatdayIdx][i].fromPrevious;
    }

    newFinishAbsoluteMin = newStartAbsoluteMin + stayingMin;

    while (newStartAbsoluteMin >= 1440) {
      newStartAbsoluteMin -= 1440;
    }

    while (newStartAbsoluteMin < 0) {
      newStartAbsoluteMin += 1440;
    }

    while (newFinishAbsoluteMin >= 1440) {
      newFinishAbsoluteMin -= 1440;
    }

    while (newFinishAbsoluteMin < 0) {
      newFinishAbsoluteMin += 1440;
    }

    stayingInfos[whatdayIdx][i].start = newStartAbsoluteMin;
    stayingInfos[whatdayIdx][i].finish = newFinishAbsoluteMin;
    var spotStayingStart = getHHMMFromAbsoluteMinute(newStartAbsoluteMin).substr(0, 2) + ":" + getHHMMFromAbsoluteMinute(newStartAbsoluteMin).substr(2, 2);
    var spotStayingFinish = getHHMMFromAbsoluteMinute(newFinishAbsoluteMin).substr(0, 2) + ":" + getHHMMFromAbsoluteMinute(newFinishAbsoluteMin).substr(2, 2);
    var spot = spotsByDay[whatdayIdx][i + 1]; // visitInfo = {visitDay: (요일), visitTime: (방문시간, HHMM), staySec: (체류시간)}

    var visitDay = (startTravelDate.getDay() + whatdayIdx - 1) % 7;
    var visitTime = getHHMMFromAbsoluteMinute(newStartAbsoluteMin);
    var staySec = Number($("#spotStayingH" + spot.no).val()) * 3600 + Number($("#spotStayingM" + spot.no).val()) * 60;
    $("#toastToRegisterSpots").css("display", "none");

    if (!checkTimeIfAvailable(spot, {
      visitDay: visitDay,
      visitTime: visitTime,
      staySec: staySec
    })) {
      $("#timeTableIcon" + spot.no).css("color", "#FF0000");
      $("#timeTableIcon" + spot.no).addClass("heartbeat");
      $("#openTimes" + spot.no + " li").each(function (index, element) {
        if (index == visitDay) {
          $(this).css({
            color: "#FF0000"
          });
        } else {
          $(this).css({
            color: "#ffffff"
          });
        }
      });
      showToastMsg(i18nSvc.get('scheduleProblem'));
    } else {
      $("#openTimes" + spot.no + " li").each(function (index, element) {
        if (index == visitDay) {
          $(this).css({
            color: "#FFFF00"
          });
        } else {
          $(this).css({
            color: "#ffffff"
          });
        }
      });
      $("#timeTableIcon" + spot.no).css("color", "#37474f");
      $("#timeTableIcon" + spot.no).removeClass("heartbeat");
    }

    $("#spotStayingStart" + spot.no).val(spotStayingStart);
    $("#spotStayingFinish" + spot.no).val(spotStayingFinish);
    setTimeout(function () {
      $("#spotStayingStart" + spot.no).addClass("blink-1");
      $("#spotStayingFinish" + spot.no).addClass("blink-1");
      setTimeout(function () {
        $("#spotStayingStart" + spot.no).removeClass("blink-1");
        $("#spotStayingFinish" + spot.no).removeClass("blink-1");
      }, i * 200 + 1000);
    }, i * 200);
  };

  for (var i = startIdx; i < stayingInfos[whatdayIdx].length; i++) {
    var _ret = _loop6(i);

    if (_ret === "break") break;
  }
} //두 장소간의 거리를 서버에서 받아온다


function getDurationBetweenSpotsWithNo(startPointNo, destPointNo) {
  return new Promise(function (resolve, reject) {
    showLoading();
    $.ajax({
      type: 'GET',
      url: headAddress + '/getDurationBetweenSpotsWithNo',
      data: {
        transportationMode: transportationMode,
        cityName: cityName,
        startPointNo: startPointNo,
        destPointNo: destPointNo
      },
      success: function success(data) {
        hideLoading();
        resolve(Math.floor(data.duration / 60));
      }
    });
  });
} //서버로부터 일정을 받아와서 setMap 호출


function getRouteAndSetMap(reqData) {
  showLoading(i18nSvc.get('waitCreatingTravelPlan'));
  $.ajax({
    type: 'POST',
    url: headAddress + '/makeRoute',
    data: reqData,
    success: function success(data) {
      //console.log(data);
      dataFromServer = data;
      backupDataFromServer = JSON.parse(JSON.stringify(dataFromServer));
      setMap(dataFromServer); //            if ($(window).width() > 600) {
      //                openGuidepageAfterMakeroute();
      //            }
    },
    fail: function fail() {
      showToastMsg(i18nSvc.get('failToMakePlan'));
    },
    complete: function complete() {
      hideLoading();
    }
  });
  document.getElementById('routepage').style.display = 'block';
  $('html, body').css({
    'overflow': 'hidden',
    'height': '100%'
  }); //튜토리얼
} // 지도에 장소마커 설정


function setMarkerOnMap(spot, icon) {
  var markerName = '/marker-icon';

  if (spot.isSpot == 0) {
    markerName += '-res';
  }

  marker = new google.maps.Marker({
    position: {
      lat: Number(spot.lat),
      lng: Number(spot.lng)
    },
    label: {
      text: spot.showingName.split("(")[0].replace(" ", "").substr(0, 2),
      color: '#ffffff',
      fontSize: "10px",
      fontWeight: "500"
    },
    map: map
  }); // 호텔 이미지 및 라벨 작업 '시작'(LSH)

  var iconH = {
    url: headAddress + '/myro_image/hotel-imgN.png',
    scaledSize: new google.maps.Size(30, 30)
  }; // 호텔 이미지 및 라벨 작업 '끝'

  if (icon && icon == 'hotel') marker.setIcon(iconH); // 이미지주소변경(LSH)
  else marker.setIcon({
      url: headAddress + markerName,
      scaledSize: new google.maps.Size(30, 30)
    });
  marker.spotNo = spot.no;
  marker.setMap(map);
  markers.push(marker);
  marker.addListener('click', function () {
    openLocationInfo("" + spot.showingName + "<br>주소 : " + spot.address, marker, 'Spot', spot.no);
  });
} // 지도에 호텔마커 설정


function setHotelMarkerOnMap(hotel, hotelChekedDay) {
  if (hotelMarkers[hotelChekedDay] && hotelMarkers[hotelChekedDay].setMap) hotelMarkers[hotelChekedDay].setMap(null);
  marker = new google.maps.Marker({
    position: {
      lat: Number(hotel.lat),
      lng: Number(hotel.lng)
    },
    label: {
      //			text: hotel.showingName.split("(")[0].replace(" ", "").substr(0, 2),
      text: $.trim(hotel.showingName.split("(")[0]),
      // 호텔 이름 표시 ( 기준으로 영문 잘라내고 공백제거(LSH)
      color: '#000000',
      fontSize: "12px",
      fontWeight: "700"
    },
    map: map
  }); // 호텔 이미지 및 라벨 작업 '시작'(LSH)

  var iconH = {
    url: '/myro_image/hotel-img.png',
    scaledSize: new google.maps.Size(30, 30),
    labelOrigin: new google.maps.Point(15, -1)
  }; // 호텔 이미지 및 라벨 작업 '끝'

  marker.setIcon(iconH); // 이미지주소변경(LSH)

  marker.spotNo = hotel.no;
  marker.setMap(map);
  hotelMarkers[hotelChekedDay] = marker;
  marker.addListener('click', function () {
    openLocationInfo("" + hotel.showingName + "<br>주소 : " + hotel.address, marker, 'Hotel', hotel.no);
  });
} // 지도에 마커 지우기


function deleteMarkerOnMap(spot) {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i].spotNo == spot.no) {
      markers[i].setMap(null);
      markers.splice(i, 1);
      i--;
    }
  }
} // 지도에 마커 전부 지우기


function deleteAllMarkerOnMap(spot) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }

  markers = [];
} // infobox 생성


function setInfoboxOnMap(content, marker) {
  infowindow = new google.maps.InfoWindow({
    content: content
  });
  infowindow.open(map, marker);
} // 일정생성 후 지도에 장소마커 설정


function setMarkerOnRouteMapWithNumber(spot, markerName) {
  spot.whatDay += "";
  var text = spot.whatDay;

  if (spot.isSpot == 0) {
    markerName += "-res";
    text = " ";
  }

  if (text == 0) {
    if (spot.isSpot == 0) {
      text = " ";
    } else if (spot.isSpot == 1) {
      text = "?";
    }
  }

  marker = new google.maps.Marker({
    position: {
      lat: Number(spot.lat),
      lng: Number(spot.lng)
    },
    label: {
      text: text,
      color: '#ffffff',
      fontSize: "10px",
      fontWeight: "500"
    },
    //아이콘 바꾸기
    map: map2
  });
  marker.setIcon({
    url: headAddress + '/markerByDay?whatDay=' + markerName,
    scaledSize: new google.maps.Size(28, 28)
  });
  marker.spotNo = spot.no;
  marker.setMap(map2);
  marker.addListener('click', function () {
    openLocationInfo("" + spot.showingName + "<br>주소 : " + spot.address, marker, 'Spot', spot.no);
  });
  markersOnRouteMap.push(marker);
} // 일정생성 직후 지도에 호텔마커 설정 / 일자별 누를때 호텔 & 장소마커 설정


function setMarkerOnRouteMap(spot, icon) {
  var markerName = spot.whatDay;

  if (spot.isSpot == 0) {
    markerName += "-res";
  }

  marker = new google.maps.Marker({
    position: {
      lat: Number(spot.lat),
      lng: Number(spot.lng)
    },
    label: {
      //            text: spot.showingName,
      //            text: spot.showingName.split("(")[0].replace(" ", "").substr(0, 2),
      text: $.trim(spot.showingName.split("(")[0]),
      // 호텔 이름 표시 ( 기준으로 영문 잘라내고 공백제거(LSH)
      color: '#000000',
      fontSize: "12px",
      fontWeight: "700"
    },
    map: map2
  }); // 호텔 이미지 및 라벨 작업 '시작'(LSH)

  var iconH = {
    url: '/myro_image/hotel-img.png',
    scaledSize: new google.maps.Size(30, 30),
    labelOrigin: new google.maps.Point(15, -2)
  }; // 호텔 이미지 및 라벨 작업 '끝'

  if (icon && icon == 'hotel') marker.setIcon(iconH); // 이미지주소변경(LSH)
  else marker.setIcon({
      url: headAddress + '/markerByDay?whatDay=' + markerName,
      scaledSize: new google.maps.Size(28, 28)
    });
  marker.spotNo = spot.no;
  marker.setMap(map2);
  marker.addListener('click', function () {
    openLocationInfo(i18nSvc.get('placeName') + " : " + spot.showingName + "<br>" + i18nSvc.get('address') + " : " + spot.address, marker, 'Spot', spot.no); //showToastMsg(spot.lat + "," + spot.lng);
  });
  markersOnRouteMap.push(marker);
} // 일정생성 후 지도에 마커 지우기


function deleteMarkerOnRouteMap(spot) {
  for (var i = 0; i < markersOnRouteMap.length; i++) {
    if (markersOnRouteMap[i].spotNo == spot.no) {
      markersOnRouteMap[i].setMap(null);
      markersOnRouteMap.splice(i, 1);
      i--;
    }
  }
} // 일정생성 후 지도에 모든 마커 지우기


function deleteAllMarkerOnRouteMap(spot) {
  for (var i = 0; i < markersOnRouteMap.length; i++) {
    markersOnRouteMap[i].setMap(null);
  }

  markersOnRouteMap = [];
} // //일자 체크
// $("#travelDay").change(function () {
//     if (isNaN(parseInt($("#travelDay").val()))) {
//         showToastMsg("여행일자는 숫자로 입력해주세요.");
//         $("#travelDay").val(5);
//     }
//
//     if (Number($("#travelDay").val()) % 1 != 0) {
//         showToastMsg("여행일자는 정수로 입력해주세요.");
//         $("#travelDay").val(5);
//
//     }
//
//     if ($("#travelDay").val() > 10) {
//         showToastMsg("여행일자는 10일을 초과할 수 없습니다.");
//         $("#travelDay").val(10);
//     }
//     if ((selectedSpots.length + 1) / $('#travelDay').val() > 9) {
//         showToastMsg("하루당 평균 8장소 이상 선택 불가");
//         $("#travelDay").val(Math.floor(selectedSpots.length / 10 + 1));
//         return;
//     }
//
//     setTravelDay();
//     $("#showingTravelDay").html($("#travelDay").val());
//     $("#traveltextdiv").addClass("blink-2");
//
// });
//N일차 일자별 상세보기


function openDayDetailPlan(whatDay) {
  if (tempMarkerForInfobox) {
    tempMarkerForInfobox.setMap(null);
  }

  closePlanSideBar();
  openPlanPageWidely = false;
  $('#remakeAndRestoreButtonArea').css("display", "none");
  $('#allDayDetailScheduleDiv').css("display", "none");
  $('#allDayDetailScheduleExpDiv').css("display", "none");
  $('#msidebar2changeButton').css("display", "none");

  if ($(window).width() <= 1600) {
    $(".msidebar2Ani").css("width", "235px");
  } else {
    $(".msidebar2Ani").css("width", "265px");
  }

  $("#msidebar2Ani").css("min-width", "0");
  $("#whatDayForDetail").html(whatDay + i18nSvc.get('day') + " ");
  $('#travelDayText').css("display", "none");
  $('#ssbmbtndiv-Lbtn').css("display", "none");
  $('#SSbarAfterMakeRoute').css("display", "none");

  if (directionsDisplay) {
    directionsDisplay.setMap(null);
  }

  removeAllFlightPath();
  deleteAllMarkerOnRouteMap(); //나중에 받아오는 호텔로 바꿔야됨

  setMarkerOnRouteMap(dataFromServer.spotsByDay[whatDay][0], 'hotel');

  for (var i = 1; i < dataFromServer.spotsByDay[whatDay].length; i++) {
    setMarkerOnRouteMap(dataFromServer.spotsByDay[whatDay][i]);
  }

  ablePulse(whatDay);
  $("#dailyRoute").html("");
  $('#dailyRoute').css("display", "block");
  var spotCnt = dataFromServer.spotsByDay[whatDay].length;

  for (var _i11 = 0; _i11 < spotCnt; _i11++) {
    var startPoint = _i11;
    var endPoint = _i11 + 1;
    if (startPoint == spotCnt - 1) endPoint = 0;
    var detailByStep = "";
    var dailyStepSchedule = '<div class="dayroutecontainer card z-depth-2"><div class="dayrouteStepCss">STEP' + [_i11 + 1] + '</div><div>' + '<img src="/myro_image/placepoint16.png" style="vertical-align: 4px;" alt="image">' + dataFromServer.spotsByDay[whatDay][startPoint].showingName + '<br>' + '<img src="/myro_image/ad1.png" style="vertical-align: 1px;" alt="image">' + '<br>' + '<img src="/myro_image/placepoint16.png" style="vertical-align: 4px;" alt="image">' + dataFromServer.spotsByDay[whatDay][endPoint].showingName + '</div>' + '<div  id="day' + whatDay + 'dailyStep' + _i11 + '"class="btn dailyStepDetailBtn w3-hover-blue"><hs>' + i18nSvc.get('route') + '</hs>' + '<i class="material-icons" style="">arrow_drop_down</i></div>' + '<div class="dailyRouteDetailByStepWDiv" style="display:none;" id="dailyRouteDetailByStep' + whatDay + "order" + _i11 + '"></div></div>';
    $("#dailyRoute").append(dailyStepSchedule);
    $(".datepickModalViewboxwrap").css("display", "block");
    $(".datepickModalViewbox").css("display", "block");
    $("#ViewboxWhatDayCnt").html(whatDay);
    $("#ViewboxSeletedSpotsCnt").html(spotCnt - 1); //        let totalAbsoluteMins = dataFromServer.stayingInfos[whatDay][spotCnt - 1].finish - dataFromServer.stayingInfos[whatDay][0].start + dataFromServer.stayingInfos[whatDay][0].fromPrevious;
    //        let totalTimeH = Math.floor(totalAbsoluteMins/60);
    //        let totalTimeM = Math.floor(totalAbsoluteMins%60);
    //        $("#WhatDaytotalTimeH").html(totalTimeH);
    //        $("#WhatDaytotalTimeM").html(totalTimeM);
    //        $("#spotInfo_Web").append(dailyStepSchedule);

    setOpenDetailRouteButton(whatDay, _i11, startPoint, endPoint);
  }

  drawAllFlightPathForCertainDay(whatDay);
  addUserTrackingData('openDayDetailPlan|' + whatDay);
} //각 일자별 상세경로 버튼 생성


function setOpenDetailRouteButton(whatDay, i, startPoint, endPoint) {
  $("#day" + whatDay + "dailyStep" + i).click(function () {
    openDetailRoute('dailyRouteDetailByStep' + whatDay + 'order' + i, whatDay, startPoint, endPoint);
  });
}

var directionsService;
var directionsDisplay; //구글 direction기반 상세경로 보기

function openDetailRoute(divId, whatDay, startPoint, endPoint, tryCnt) {
  if (nation == 'korea' && transportationMode == "DRIVING") {
    var sX, sY, eX, eY;
    $.ajax({
      url: headAddress + '/changeCoordsForKakaoMapDirection',
      data: {
        lat: dataFromServer.spotsByDay[whatDay][startPoint].lat,
        lng: dataFromServer.spotsByDay[whatDay][startPoint].lng
      },
      success: function success(res) {
        sX = res.x;
        sY = res.y;
        $.ajax({
          url: headAddress + '/changeCoordsForKakaoMapDirection',
          data: {
            lat: dataFromServer.spotsByDay[whatDay][endPoint].lat,
            lng: dataFromServer.spotsByDay[whatDay][endPoint].lng
          },
          success: function success(res) {
            eX = res.x;
            eY = res.y;
            window.open("https://map.kakao.com/?sX=".concat(sX, "&sY=").concat(sY, "&sName=").concat(dataFromServer.spotsByDay[whatDay][startPoint].showingName, "&eX=").concat(eX, "&eY=").concat(eY, "&eName=").concat(dataFromServer.spotsByDay[whatDay][endPoint].showingName), '_blank');
          }
        });
      }
    });
  } else {
    if ($('#' + divId).css("display") == 'none') {
      if (directionsDisplay) {
        directionsDisplay.setMap(null);
      }

      directionsService = new google.maps.DirectionsService();
      directionsDisplay = new google.maps.DirectionsRenderer({
        map: map2
      });
      var origin, destination;

      if (tryCnt == 1) {
        origin = dataFromServer.spotsByDay[whatDay][startPoint].googleSearchedName;
        destination = dataFromServer.spotsByDay[whatDay][endPoint].lat + "," + dataFromServer.spotsByDay[whatDay][endPoint].lng;
      } else if (tryCnt == 2) {
        origin = dataFromServer.spotsByDay[whatDay][startPoint].lat + "," + dataFromServer.spotsByDay[whatDay][startPoint].lng;
        destination = dataFromServer.spotsByDay[whatDay][endPoint].googleSearchedName;
      } else if (tryCnt == 3) {
        origin = dataFromServer.spotsByDay[whatDay][startPoint].googleSearchedName;
        destination = dataFromServer.spotsByDay[whatDay][endPoint].googleSearchedName;
      } else {
        tryCnt = 0;
        origin = dataFromServer.spotsByDay[whatDay][startPoint].lat + "," + dataFromServer.spotsByDay[whatDay][startPoint].lng;
        destination = dataFromServer.spotsByDay[whatDay][endPoint].lat + "," + dataFromServer.spotsByDay[whatDay][endPoint].lng;
      }

      directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: transportationMode
      }, function (response, status) {
        if (status === 'OK') {
          $('#' + divId).css("display", "");
          directionsDisplay.setPanel(null);
          directionsDisplay.setDirections(response); //showSteps(response, markerArray, stepDisplay, map);

          var myRoute = response.routes[0].legs[0];
          var routeDetailAppendText = "";

          for (var i = 0; i < myRoute.steps.length; i++) {
            var lat = (myRoute.steps[i].start_location.lat() + myRoute.steps[i].end_location.lat()) / 2;
            var lng = (myRoute.steps[i].start_location.lng() + myRoute.steps[i].end_location.lng()) / 2;
            routeDetailAppendText += '<div class = "routeDetailScale" onclick="map2.panTo({lat: ' + lat + ',lng: ' + lng + '});">' + '<hs style="color:#FFA500;font-weight: 900">' + [i + 1] + '.&nbsp;</hs> ' + myRoute.steps[i].instructions + '<br></div>';
          }

          routeDetailAppendText += '<div class="w3-dark-grey routeDetailtimeDiv"><i class="material-icons">access_time</i>' + "&nbsp;" + i18nSvc.get('estimatedDuration') + " : " + myRoute.duration.text + '</div>';
          $('#' + divId).html(routeDetailAppendText);
        } else {
          if (tryCnt == 3) {
            showToastMsg(i18nSvc.get('cantFindRouteOnGoogleMap'));
          } else {
            tryCnt++;
            openDetailRoute(divId, whatDay, startPoint, endPoint, tryCnt);
          }
        }
      });
    } else {
      $('#' + divId).css("display", "none");
    }
  }
} //모든일정 전체일정 보기


function seeAllDaySchedule() {
  closePlanSideBar();
  openPlanPageWidely = false;
  $("#dailyRoute").css("display", "none");
  $(".datepickModalViewboxwrap").css("display", "none");
  $(".datepickModalViewbox").css("display", "none");
  $('#remakeAndRestoreButtonArea').css("display", "");
  $('#allDayDetailScheduleDiv').css("display", "");
  $('#allDayDetailScheduleExpDiv').css("display", "");
  $('#msidebar2changeButton').css("display", "");
  $("#whatDayForDetail").html("");

  if ($(window).width() <= 600) {
    $("#seeallDaybtnweb").css("background-color", "#26DBE1");
    $("#seeallDaybtnweb").css("border-color", "#26DBE1");
  }

  if ($(window).width() <= 1600) {
    $(".myro-msidebar2").css("width", "235px");
  } else {
    $(".myro-msidebar2").css("width", "265px");
  }

  $('#travelDayText').css("display", "block");
  $('#ssbmbtndiv-Lbtn').css("display", "block");
  SsOpened = false;

  if (directionsDisplay) {
    directionsDisplay.setMap(null);
  }

  removeAllFlightPath();
  deleteAllMarkerOnRouteMap();
  ablePulse(0);

  for (var i = 0; i < dataFromServer.spotsByDay.length; i++) {
    if (i != 0) {
      setMarkerOnRouteMap(dataFromServer.spotsByDay[i][0], 'hotel');
    }

    for (var j = 1; j < dataFromServer.spotsByDay[i].length; j++) {
      var _spot6 = dataFromServer.spotsByDay[i][j];
      setMarkerOnRouteMapWithNumber(_spot6, i + "");
    }
  }

  map2.panTo({
    lat: dataFromServer.spotsByDay[0][0].lat,
    lng: dataFromServer.spotsByDay[0][0].lng
  });
  map2.setZoom(12);
  drawAllFlightPath();

  for (var _i12 = 0; _i12 < $('#travelDay').val(); _i12++) {
    $("#dayButton" + _i12).css("background-color", "#ffffff");
    $("#dayButton" + _i12).css("color", "#000000"); //        $("#dayButton" + i).css("border-bottom-color", "#757575");
  }

  $("#dailyRoute").html("");
  $("#dailyRoute").css("display", "none");
} //엑셀로 일정 다운로드 받기


function getScheduleFileByExcel() {
  var reqParam = {};
  var stayingInfos = backupDataFromServer.stayingInfos;
  var spotsByDay = backupDataFromServer.spotsByDay;
  var scheduleByDay = [];

  for (var i = 1; i < spotsByDay.length; i++) {
    scheduleByDay[i] = {};
    scheduleByDay[i].scheduleBySpots = [];
    var stayingInfo = stayingInfos[i];
    var today = new Date(startTravelDate);
    today.setDate(startTravelDate.getDate() + i - 1);
    var dayShowingStartTime = void 0,
        weekDay = void 0,
        month = void 0,
        day = void 0;

    if (spotsByDay[i].length == 1) {
      dayShowingStartTime = "00:00";
      weekDay = today.getDay() % 7;
      month = today.getMonth() + 1;
      day = today.getDate();
    } else {
      var dayStartTimeMin = stayingInfo[0].start - stayingInfo[0].fromPrevious;
      var dayStartTimeHHMM = getHHMMFromAbsoluteMinute(dayStartTimeMin);
      dayShowingStartTime = dayStartTimeHHMM.substr(0, 2) + ":" + dayStartTimeHHMM.substr(2, 4);
      weekDay = today.getDay() % 7;
      month = today.getMonth() + 1;
      day = today.getDate();
    } //scheduleByDay[i].dayInfo = `${i}일차 ${month}월 ${day}일 ${weekDayKor[weekDay]}`;


    scheduleByDay[i].dayInfo = "".concat(i).concat(i18nSvc.get('day'), "\u3000").concat(i18nSvc.get('monthList')[month], " ").concat(day).concat(i18nSvc.get('whatDay'), " ").concat(i18nSvc.get('weekDays')[weekDay]);
    scheduleByDay[i].scheduleBySpots[0] = dayShowingStartTime;

    for (var j = 1; j < spotsByDay[i].length; j++) {
      var _spot7 = spotsByDay[i][j];
      var spotStayingInfo = stayingInfo[j - 1];
      var spotStayingMinutes = Math.floor(_spot7.realStaySec / 60);

      while (spotStayingMinutes < 0) {
        spotStayingMinutes += 1440;
      }

      var spotStayingH = Math.floor(spotStayingMinutes / 60);
      var spotStayingM = Math.floor(spotStayingMinutes % 60);
      var spotStayingStart = getHHMMFromAbsoluteMinute(spotStayingInfo.start).substr(0, 2) + ":" + getHHMMFromAbsoluteMinute(spotStayingInfo.start).substr(2, 4);
      var spotStayingFinish = getHHMMFromAbsoluteMinute(spotStayingInfo.finish).substr(0, 2) + ":" + getHHMMFromAbsoluteMinute(spotStayingInfo.finish).substr(2, 4);
      var spotSchedule = {};
      spotSchedule.spotStayingStart = spotStayingStart;
      spotSchedule.spotStayingH = spotStayingH;
      spotSchedule.spotStayingM = spotStayingM;
      spotSchedule.spotStayingFinish = spotStayingFinish;
      scheduleByDay[i].scheduleBySpots.push(spotSchedule);
    }
  }

  reqParam.cityName = korCityName;
  reqParam.spotsByDay = spotsByDay;
  reqParam.scheduleByDay = scheduleByDay;
  reqParam.travelDay = travelDay;
  var reqData = {};
  checkBeforeCloseWindow = false;
  reqData.data = JSON.stringify(reqParam);
  $.ajax({
    type: 'POST',
    url: headAddress + '/makeScheduleAndSendFileName',
    data: reqData,
    success: function success(fileName) {
      addUserTrackingData("getScheduleFileByExcel ".concat(fileName));
      location.href = "".concat(headAddress, "/getScheduleFileByExcel?fileName=").concat(fileName, "&cityName=").concat(korCityName);
      document.getElementById('modalInflowWrap').style.display = 'block';
      checkBeforeCloseWindow = true;
    }
  });
} //일정 이메일로 전송


function saveRouteAndSendEmail() {
  var emailList = [];

  for (var i = 0; i < $("input[name*='emailAddress']").length; i++) {
    emailList.push($("input[name*='emailAddress']")[i].value);
  }

  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  for (var i = 0; i < emailList.length; i++) {
    if (emailList[i] == "") {
      emailList.splice(i, 1);
      i--;
      continue;
    }

    if (!re.test(emailList[i])) {
      showToastMsg(i18nSvc.get('wrongEmailFormat'));
      return;
    }
  }

  if (emailList.length == 0) {
    showToastMsg(i18nSvc.get('atLeastOneEmail'));
    return;
  }

  showLoading();
  $("#saveRouteAndSendEmailButton").attr('disabled', true);
  var savingData = {};
  savingData.travelDay = $('#travelDay').val();
  savingData.spotsByDay = backupDataFromServer.spotsByDay;
  savingData.stayingInfos = backupDataFromServer.stayingInfos;
  savingData.originalSchedule = backupDataFromServer.originalSchedule;
  savingData.emailName = $('#emailName').val();
  savingData.emailList = emailList;
  savingData.cityName = korCityName;
  savingData.engCityName = cityName;
  savingData.transportationMode = transportationMode;
  savingData.possibleTransportationMode = possibleTransportationMode;
  savingData.airportInfo = airportInfo;
  var dateString = startTravelDate.toLocaleDateString('ko-KR'); //seperatedDateString

  var sds = "";

  if (sds.indexOf("/") != -1) {
    sds = dateString.split("/");
  } else if (sds.indexOf("-") != -1) {
    sds = dateString.split("-");
  } else {
    sds = dateString.split(". ");
  }

  sds[2] = sds[2].split(".")[0];

  if (Number(sds[1]) < 10) {
    sds[1] = "0" + sds[1];
  }

  if (Number(sds[2]) < 10) {
    sds[2] = "0" + sds[2];
  }

  savingData.startTravelDate = "".concat(sds[0], "-").concat(sds[1], "-").concat(sds[2]);
  var reqData = {};
  reqData.data = JSON.stringify(savingData);
  $.ajax({
    type: 'POST',
    url: headAddress + '/saveRouteAndSendEmail',
    data: reqData,
    success: function success(data) {
      showToastMsg("이메일 발송에 성공하였습니다.");
      $("#saveRouteAndSendEmailButton").attr('disabled', false);
      hideLoading();
      document.getElementById('modalInflowWrap').style.display = 'block';
    },
    fail: function fail() {
      $("#saveRouteAndSendEmailButton").attr('disabled', false);
      hideLoading();
    }
  });
}

; //토큰이 있을 때 일정을 수정후 저장

function updateDataIfHaveToken() {
  showLoading();
  var savingData = backupDataFromServer;
  savingData.travelDay = $('#travelDay').val();
  savingData.savedRouteToken = savedRouteToken;
  savingData.airportInfo = backupDataFromSavedToken.airportInfo;
  savingData.cityName = backupDataFromSavedToken.cityName;
  savingData.engCityName = backupDataFromSavedToken.engCityName;
  savingData.emailList = backupDataFromSavedToken.emailList;
  savingData.emailName = backupDataFromSavedToken.emailName;
  savingData.possibleTransportationMode = backupDataFromSavedToken.possibleTransportationMode;
  savingData.transportationMode = backupDataFromSavedToken.transportationMode;
  var dateString = startTravelDate.toLocaleDateString('ko-KR'); //seperatedDateString

  var sds = dateString.split(". ");
  sds[2] = sds[2].split(".")[0];

  if (Number(sds[1]) < 10) {
    sds[1] = "0" + sds[1];
  }

  if (Number(sds[2]) < 10) {
    sds[2] = "0" + sds[2];
  }

  savingData.startTravelDate = "".concat(sds[0], "-").concat(sds[1], "-").concat(sds[2]);
  var reqData = {};
  reqData.data = JSON.stringify(savingData);
  $.ajax({
    type: 'POST',
    url: headAddress + '/saveRouteAndSendEmail',
    data: reqData,
    success: function success(data) {
      showToastMsg(i18nSvc.get('modifiedScheduleSaved'));
      hideLoading();
    },
    fail: function fail() {
      hideLoading();
    }
  });
} //일정전송 or 수정저장


$("#saveButton").click(function () {
  if (savedRouteToken) {
    updateDataIfHaveToken();
  } else {
    document.getElementById('save').style.display = '';
    $("#emailName").focus();
    showToastMsg(i18nSvc.get('whenClickSendPlan'), 10);
  }

  addUserTrackingData('saveButton click');
});
$("#closeSaveButton").click(function () {
  document.getElementById('routepage').style.display = 'none';
  return;

  if (savedRouteToken) {
    location.href = "/myro2?city=" + cityName;
  } else {
    document.getElementById('routepage').style.display = 'none';
  }
}); //이메일 추가버튼

$("#addEmailInputButton").click(function () {
  if ($('#emailList input').length == 10) {
    showToastMsg(i18nSvc.get('maximumTenEmail'));
    return;
  }

  $('#emailList').append('<input class="" name="emailAddress" type="text" placeholder="이메일 주소" maxlength="200">'); //    $('#emailList').append(
  //            '<div style="display: flex"><input class="input-field" name="emailAddress" type="text" placeholder="이메일 주소" maxlength="200" style="width:30%"><input class="input-field" name="emailSelectAddress" type="text" id="emailSA'+ i +'" style="width:30%"><select name="selectEmailList" class="browser-default" id="selectEmailBox'+ i +'" style="width:40%;background-color:#d3d3d3;"><option>직접입력</option><option>@naver.com</option><option>@gmail.com</option><option>@hanmail.net</option><option>@nate.com</option></select></div>'
  //    );

  $("input[name*='emailAddress']").removeAttr("keyup");
  $("input[name*='emailAddress']").keyup(function (event) {
    if (event.keyCode == 13) {
      $("#saveRouteAndSendEmailButton").click();
    }
  });
  $("input[name*='emailAddress']")[$('#emailList input').length - 1].focus();
}); //이메일 제거버튼

$("#removeEmailInputButton").click(function () {
  if ($('#emailList input').length != 1) {
    $('#emailList input')[$('#emailList input').length - 1].remove();
  }
});
$("#copyRouteTokenBtnT").click(function () {
  window.Clipboard = function (window, document, navigator) {
    var textArea, copy;

    function isOS() {
      return navigator.userAgent.match(/ipad|iphone/i);
    }

    function createTextArea(text) {
      textArea = document.createElement('textArea');
      textArea.value = text;
      document.body.appendChild(textArea);
    }

    function selectText() {
      var range, selection;

      if (isOS()) {
        range = document.createRange();
        range.selectNodeContents(textArea);
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        textArea.setSelectionRange(0, 999999);
      } else {
        textArea.select();
      }
    }

    function copyToClipboard() {
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }

    copy = function copy(text) {
      createTextArea(text);
      selectText();
      copyToClipboard();
    };

    return {
      copy: copy
    };
  }(window, document, navigator);

  Clipboard.copy(savedRouteToken);
  alert('키가 복사되었습니다.'); // $('body').scrollTop(0);
}); //이메일 셀렉트 테스트//이메일 셀렉트 테스트//이메일 셀렉트 테스트//이메일 셀렉트 테스트//이메일 셀렉트 테스트//이메일 셀렉트 테스트//이메일 셀렉트 테스트
//$(document).ready(function(){
//    $("#selectEmailBox").change(function(){
//        var value = $("#selectEmailBox option:selected").text();
//        if(value!="직접입력"){
//            $("#emailSA").val(value);
//            $("#emailSA").attr("disabled",true);
//        }else{
//            $("#emailSA").val("@");
//            $("#emailSA").attr("disabled",false);            
//        }
//    });
//    
//});

function openLocationInfo(innerContext, marker, hotelOrSpot, no) {
  if (no) {
    $("#locationInfoImage").attr('src', headAddress + '/get' + hotelOrSpot + 'Image/' + cityName + '?no=' + no);
  }

  $("#locationInfoContext").html(innerContext);
  $("#locationInfoContext").css("font-size", "13px");
  $("#locationInfo").css("display", "block");
}

;

function reqSpotRegClose() {
  $("#reqSpotReg").css("display", "none");
  $('#reqSpotRegDesc').val("");
  $('#reqSpotRegName').val("");
}

;

function registerSpotToast() {
  $("#reqSpotRegButton").removeClass("blink-3");
  setTimeout(function () {
    showToastMsg(i18nSvc.get('registerPlaceIfNotExists'));
    $("#reqSpotRegButton").addClass("blink-3");
  }, 100);
}

;

function showToastMsg(txt, sec) {
  $("#toastToRegisterSpots").css("display", "none");
  setTimeout(function () {
    if (!sec) {
      sec = 3;
    }

    $("#toastMsg").html(txt);
    $("#toastToRegisterSpots").css("display", "block");
    clearTimeout(hideToast);
    hideToast = setTimeout(function () {
      $("#toastToRegisterSpots").css("display", "none");
    }, sec * 1000);
  }, 100);
}

function reqSearchSpotRegClose() {
  $("#reqSearchSpotReg").css("display", "none");
} //좌표간 선그리기


function drawAllFlightPath() {
  removeAllFlightPath();
  flightPath = [];
  var lineSymbol = {
    path: google.maps.SymbolPath.FORWARD_OPEN_ARROW
  };
  var spotsByDay = dataFromServer.spotsByDay;

  for (var i = 1; i < spotsByDay.length; i++) {
    flightPath[i] = [];

    for (var j = 0; j < spotsByDay[i].length; j++) {
      if (spotsByDay[i].length < 2) {
        continue;
      }

      var targetOrder = j + 1;
      if (targetOrder == spotsByDay[i].length) targetOrder = 0;
      flightPath[i][j] = new google.maps.Polyline({
        path: [{
          lat: Number(spotsByDay[i][j].lat),
          lng: Number(spotsByDay[i][j].lng)
        }, {
          lat: Number(spotsByDay[i][targetOrder].lat),
          lng: Number(spotsByDay[i][targetOrder].lng)
        }],
        geodesic: true,
        strokeColor: colors[i - 1],
        strokeOpacity: 1.0,
        strokeWeight: 2,
        icons: [{
          icon: lineSymbol,
          offset: '100%'
        }]
      });
      flightPath[i][j].setMap(map2);
    }
  }
} //특정날짜 좌표간 선그리기


function drawAllFlightPathForCertainDay(certainDay) {
  removeAllFlightPath();
  flightPath = [];
  var lineSymbol = {
    path: google.maps.SymbolPath.FORWARD_OPEN_ARROW
  };
  var spotsByDay = dataFromServer.spotsByDay;
  flightPath[certainDay] = [];

  for (var j = 0; j < spotsByDay[certainDay].length; j++) {
    if (spotsByDay[certainDay].length < 2) {
      continue;
    }

    var targetOrder = j + 1;
    if (targetOrder == spotsByDay[certainDay].length) targetOrder = 0;
    flightPath[certainDay][j] = new google.maps.Polyline({
      path: [{
        lat: Number(spotsByDay[certainDay][j].lat),
        lng: Number(spotsByDay[certainDay][j].lng)
      }, {
        lat: Number(spotsByDay[certainDay][targetOrder].lat),
        lng: Number(spotsByDay[certainDay][targetOrder].lng)
      }],
      geodesic: true,
      strokeColor: colors[certainDay - 1],
      strokeOpacity: 1.0,
      strokeWeight: 2,
      icons: [{
        icon: lineSymbol,
        offset: '100%'
      }]
    });
    flightPath[certainDay][j].setMap(map2);
  }
}

function removeAllFlightPath() {
  for (var i = 0; i < flightPath.length; i++) {
    if (flightPath[i]) {
      for (var j = 0; j < flightPath[i].length; j++) {
        if (flightPath[i][j]) {
          flightPath[i][j].setMap(null);
          flightPath[i][j] = null;
        }
      }
    }
  }
}

function refreshSeletedSpotsCnt() {
  if (selectedSpots.length == 0) {
    $("#cart2NoList").css("display", "block");
  }

  $("#seletedSpotsCnt").html(selectedSpots.length);
  $("#seletedSpotsCnt").css("color", "#FFA500");
  $("#seletedSpotsCnt2").html(selectedSpots.length);
  $("#seletedSpotsCnt2").css("color", "#FFA500");
}

function refreshSeletedHotelsCnt() {
  var hotelSelectedCnt = 0;

  for (var i = 0; i < selectedHotels.length; i++) {
    if (selectedHotels[i]) {
      hotelSelectedCnt++;
    }
  }

  $("#seletedHotelsCnt").html(hotelSelectedCnt);
} //HHMM형식을 00시00분부터 몇분이 경과했는지의 값을 분으로 리턴한다


function getAbsoluteMinuteFromHHMM(HHMM) {
  return Number(HHMM.substr(0, 2)) * 60 + Number(HHMM.substr(2, 4));
} //00시00분부터 몇분이 경과했는지를 HHMM 형식으로 리턴한다


function getHHMMFromAbsoluteMinute(mins) {
  if (mins < 0) {
    mins += 1440;
  }

  var h = Math.floor(mins / 60);
  var m = Math.floor(mins % 60);
  if (h < 10) h = "0" + h;
  if (m < 10) m = "0" + m;
  return "" + h + m;
} // 장소정보, 방문요일, 방문시간, 체류시간을 입력받아 가능한 스케줄이면 true, 아니면 false를 리턴
// visitInfo = {visitDay: (요일), visitTime: (방문시간, HHMM), staySec: (체류시간)}


function checkTimeIfAvailable(spot, visitInfo) {
  var openTime = spot.openTime;

  if (openTime.length == 0 || openTime[0] == "24/7") {
    return true;
  }

  var visitDay = visitInfo.visitDay;

  if (!checkDayIfAvailableWithSingleSpot(spot, visitDay)) {
    return false;
  }

  var visitTime = visitInfo.visitTime;
  var staySec = visitInfo.staySec;
  var stayHour = Math.floor(staySec / 3600);
  var stayMin = Math.floor(staySec % 3600 / 60);
  var leaveTimeH = Number(visitTime.substr(0, 2)) + stayHour;
  var leaveTimeM = Number(visitTime.substr(2, 4)) + stayMin;

  if (leaveTimeM >= 60) {
    leaveTimeH++;
    leaveTimeM = leaveTimeM % 60;
  }

  if (leaveTimeH < 10) leaveTimeH = "0" + leaveTimeH;
  if (leaveTimeM < 10) leaveTimeM = "0" + leaveTimeM;
  var leaveTime = "" + leaveTimeH + leaveTimeM;

  for (var i = 0; i < openTime.length; i++) {
    var time = openTime[i];
    var oDay = time.o[0];
    var oTime = time.o[1];
    var cDay = time.c[0];
    var cTime = time.c[1];
    var tempVisitDay = visitDay;

    if (tempVisitDay < oDay) {
      tempVisitDay += 7;
    }

    if (oDay > cDay || oDay == cDay && Number(oTime) > Number(cTime)) {
      cDay += 7;
    }

    if (oDay == tempVisitDay && Number(oTime) <= visitTime && tempVisitDay == cDay && leaveTime <= cTime) return true;
    if (oDay < tempVisitDay && tempVisitDay == cDay && leaveTime <= cTime) return true;

    if (oDay == tempVisitDay && Number(oTime) <= visitTime && tempVisitDay < cDay) {
      if (leaveTime - 2400 <= cTime) {
        return true;
      }
    }

    if (oDay < tempVisitDay && tempVisitDay < cDay) return true; //console.log(oDay, tempVisitDay, cDay, oTime, leaveTime, cTime)
  }

  return false;
} //장소 한군데와 요일을 입력받아 그 요일에 갈 수 있는지 체크


function checkDayIfAvailableWithSingleSpot(spot, visitDay) {
  var openTime = spot.openTime;

  if (openTime.length == 0 || openTime[0] == "24/7") {
    return true;
  }

  for (var j = 0; j < openTime.length; j++) {
    var time = openTime[j];
    var oDay = time.o[0];
    var oTime = time.o[1];
    var cDay = time.c[0];
    var cTime = time.c[1];
    var tempVisitDay = visitDay;
    if (tempVisitDay == oDay) return true;

    if (tempVisitDay < oDay) {
      tempVisitDay += 7;
    }

    if (oDay > cDay || oDay == cDay && Number(oTime) > Number(cTime)) {
      cDay += 7;
    }

    if (oDay < tempVisitDay && tempVisitDay < cDay) return true;
    if (oDay < tempVisitDay && tempVisitDay == cDay && cTime != "0000") return true;
  }

  return false;
} //장소등록 장소 호텔 식당 변경시 장소이름에 포커스


$('input[type=radio][name=spotOrHotelForRegisterSpot]').change(function () {
  if ($(window).width() >= 600) {
    $("#reqSpotRegName").focus();
  }
}); //대중교통 / 차량 모드 변경시

$('input[type=radio][name=transportationMode]').change(function () {
  if ($("input[name='transportationMode']")[0].checked) {
    //DRIVING모드로 변경
    if (possibleTransportationMode.transit == 0) {
      showToastMsg(i18nSvc.get('googleDoesntProvideGooglemapTransitMode'));
      $("input[name='transportationMode']")[1].checked = true;
      return;
    }

    transportationMode = "TRANSIT";
    $('#transitbtn').addClass("orange");
    $('#drivebtn').removeClass("orange");
  } else if ($("input[name='transportationMode']")[1].checked) {
    //DRIVING모드로 변경
    if (possibleTransportationMode.driving == 0) {
      showToastMsg(i18nSvc.get('googleDoesntProvideGooglemapDrivingMode'));
      $("input[name='transportationMode']")[0].checked = true;
      return;
    }

    transportationMode = "DRIVING";
    $('#drivebtn').addClass("orange");
    $('#transitbtn').removeClass("orange");
  }

  addUserTrackingData('change transportationMode|' + transportationMode);
});

function ablePulse(whatDay) {
  for (var i = 0; i < dataFromServer.spotsByDay.length; i++) {
    $("#dayButton" + i).css("background-color", "#ffffff");
    $("#dayButton" + i).css("color", "#000000");

    if ($(window).width() >= 600) {
      $("#dayButton" + i).removeClass("pulse");
    } else {
      $("#dayButton" + i).css("border-bottom-color", "#000000");
    } //        $("#dayButton" + i).css("opacity", "0.8");

  }

  if (whatDay == 0) {
    return;
  }

  if ($(window).width() >= 600) {
    $("#dayButton" + whatDay).css("background-color", "#0091ea");
    $("#dayButton" + whatDay).addClass("pulse");
    $("#dayButton" + whatDay).css("color", "#ffffff");
  } else {
    $("#dayButton" + whatDay).css("border-bottom-color", "#26DBE1");
  }

  w3_SSclose();
  $('#ssbmbtndiv-Lbtn').css("display", "none");

  if ($(window).width() <= 600) {
    $("#seeallDaybtnweb").css("background-color", "#000000");
    $("#seeallDaybtnweb").css("border-color", "#000000");
  } //    $("#dayButton" + whatDay).css("opacity", "0.9");

} //토큰 가지고 들어올 때 여행 마지막날 세팅


function setEndTravelDateAfterSettingStartDateAndSetEDailyTimeSettingArea(startTravelDate) {
  endTravelDate = new Date(startTravelDate);
  endTravelDate.setDate(startTravelDate.getDate() + travelDay - 1);
  var startYear = startTravelDate.getFullYear();
  var startMonth = ("0" + (startTravelDate.getMonth() + 1)).slice(-2);
  var startDay = ("0" + startTravelDate.getDate()).slice(-2);
  var endYear = endTravelDate.getFullYear();
  var endMonth = ("0" + (endTravelDate.getMonth() + 1)).slice(-2);
  var endDay = ("0" + endTravelDate.getDate()).slice(-2);
  var startDateForHtmlValue = startYear + "." + startMonth + "." + startDay;
  var endDateForHtmlValue = endYear + "." + endMonth + "." + endDay;
  var fullDateForHtmlValue = startDateForHtmlValue + " - " + endDateForHtmlValue;
  $("#calander").val(fullDateForHtmlValue);
} //여행 날짜 변경부분


$(function () {
  //    $(".hiddendiv").css("visibility","visible");
  $('input[name="daterange"]').daterangepicker({
    opens: 'left'
  }, function (start, end, label) {
    //$("#openAndCloseDailyTimeSetting").click();
    travelDay = Math.ceil((end - start) / (1000 * 3600 * 24));
    startTravelDate = new Date(start._d);
    endTravelDate = new Date(start._d);
    endTravelDate.setDate(startTravelDate.getDate() + travelDay - 1);

    if (travelDay > 10) {
      showToastMsg(i18nSvc.get('noMoreThanTenTravelDays'));
      endTravelDate.setDate(startTravelDate.getDate() + 9);
      var startYear = startTravelDate.getFullYear();
      var startMonth = ("0" + (startTravelDate.getMonth() + 1)).slice(-2);
      var startDay = ("0" + startTravelDate.getDate()).slice(-2);
      var endYear = endTravelDate.getFullYear();
      var endMonth = ("0" + (endTravelDate.getMonth() + 1)).slice(-2);
      var endDay = ("0" + endTravelDate.getDate()).slice(-2);
      var startDateForHtmlValue = startYear + "." + startMonth + "." + startDay;
      var endDateForHtmlValue = endYear + "." + endMonth + "." + endDay;
      var fullDateForHtmlValue = startDateForHtmlValue + " - " + endDateForHtmlValue;
      setTimeout(function () {
        $("#calander").val(fullDateForHtmlValue);
      }, 10);
      travelDay = 10;
    }

    changeSelectedHotelAreaWhenChangeDate();
    $("#travelDay").val(travelDay);
    setDailyTimeSettingArea(startTravelDate, endTravelDate);
    totalTravelMins = travelDay * 12 * 60;
    var totalTravelH = Math.floor(totalTravelMins / 60);
    var totalTravelM = Math.floor(totalTravelMins % 60);
    $("#totalTravelH").html(totalTravelH);
    $("#totalTravelM").html(totalTravelM);
    openDailyTimesSettingArea(); //        $('#openDailyTimesSettingAreabtn').click();
    //        $('.collapsible').collapsible('open');

    $("#showingTravelDay").html(travelDay);
    $("#showingTravelDay2").html(travelDay);
    $("#showingTravelDay3").html(travelDay); //유저트래킹

    addUserTrackingData('setDate|' + startTravelDate.toDateString() + '|' + endTravelDate.toDateString());
  });
});

function setDailyTimeSettingArea(startDate) {
  $("#dailyTimesSettingArea").html("");
  var date = startDate;

  for (var i = 0; i < travelDay; i++) {
    var month = Number(date.getMonth()) + 1;
    var day = Number(date.getDate());
    var appendText = '<div style="display:flex;margin:5px 0">' + '<div style="width:25%;">' + month + '월 ' + day + '일' + '</div>' + ':' + '<div style="display:flex;width:75%;justify-content:space-around"><input class="center dailyTimesSettingArea-input" name="dailyStartTimes" type="time" value="10:00">-' + '<input class="center dailyTimesSettingArea-input" name="dailyEndTimes" type="time" value="22:00"></div></div>';
    $("#dailyTimesSettingArea").append(appendText); //        $('.timepicker').timepicki();

    date.setDate(date.getDate() + 1);
  }

  date.setDate(date.getDate() - travelDay);
  $('input[name="dailyStartTimes"]').change(function () {
    validateStartEndTimesAndReCaculateTotalTravelMins();
  });
  $('input[name="dailyEndTimes"]').change(function () {
    validateStartEndTimesAndReCaculateTotalTravelMins();
  });
}

function validateStartEndTimesAndReCaculateTotalTravelMins() {
  var TimesForTracking = "";
  totalTravelMins = 0;

  for (var i = 0; i < $('input[name="dailyStartTimes"]').length; i++) {
    var startTimeText = $('input[name="dailyStartTimes"]')[i].value.replace(":", "");
    var endTimeText = $('input[name="dailyEndTimes"]')[i].value.replace(":", "");
    var startTimeAbsoluteMins = getAbsoluteMinuteFromHHMM(startTimeText);
    var endTimeAbsoluteMins = getAbsoluteMinuteFromHHMM(endTimeText);

    if (startTimeAbsoluteMins > endTimeAbsoluteMins) {
      var endTimeToCorrectTime = getHHMMFromAbsoluteMinute(startTimeAbsoluteMins + 1);
      $('input[name="dailyEndTimes"]')[i].value = endTimeToCorrectTime.substr(0, 2) + ":" + endTimeToCorrectTime.substr(2, 4);
    }

    totalTravelMins += endTimeAbsoluteMins - startTimeAbsoluteMins;
    var totalTravelH = Math.floor(totalTravelMins / 60);
    var totalTravelM = Math.floor(totalTravelMins % 60);
    $("#totalTravelH").html(totalTravelH);
    $("#totalTravelM").html(totalTravelM);
    TimesForTracking += '|' + startTimeText + '~' + endTimeText;
  } //유저트래킹


  addUserTrackingData('changeTime' + TimesForTracking);
}

function msidebar2change() {
  if (!openPlanPageWidely) {
    openPlanSideBar();
  } else {
    closePlanSideBar();
  }

  openPlanPageWidely = !openPlanPageWidely;
  addUserTrackingData('msidebar2change|' + openPlanPageWidely);
}

function setMsidebar2AsItIs() {
  if (openPlanPageWidely) {
    openPlanSideBar(true);
  } else {
    closePlanSideBar();
  }
}

function openPlanSideBar(reopen) {
  var size1 = "auto";
  var size2 = "32%"; //    let size3 = "40%";

  if (travelDay == 1) {
    return;
  } else if (travelDay == 2) {
    size1 = "auto";
    size2 = "20%"; //        size3 = "25%";
  } //


  $("#split-bar").remove();
  $("#msidebar2Ani").prepend('<div title="' + i18nSvc.get('clickHereAndResizeAsYouWant') + '" id="split-bar" style="border-right:8px double black;height:100%; float: right; width: 8px; cursor: col-resize;"></div>');
  var min = 300;
  var max = 3600;
  var mainmin = 100;
  $('#split-bar').mousedown(function (e) {
    e.preventDefault();
    $(document).mousemove(function (e) {
      e.preventDefault();
      var x = e.pageX - $('#msidebar2Ani').offset().left;

      if (x > min && x < max && e.pageX < $(window).width() - mainmin) {
        $('#msidebar2Ani').css("width", x);
        $('#modalmap-cover').css("margin-left", x);
        $('#msidebar2Ani').css("min-width", "29%");

        if ($(window).width() <= 1600) {
          $(".myro-msidebar2").css("max-width", "70%");
        } else {
          $('#msidebar2Ani').css("max-width", "90%");
        }

        savedXForOpenPage = x;
      }
    });
  });
  $(document).mouseup(function (e) {
    $(document).unbind('mousemove');
  }); //

  $('#allDayDetailScheduleDiv').css("display", "flex"); //    $('#allDayDetailScheduleDiv').css("overflow", "auto");
  //    $('#allDayDetailScheduleDiv').css("height", "87vh");

  if ($(window).width() <= 1600) {
    $(".myro-msidebar2").css("margin-left", "50px");
  } else {
    $(".myro-msidebar2").css("margin-left", "82px");
  }

  $(".myro-msidebar2").css("width", size1);

  if ($(window).width() <= 1600) {
    $(".myro-msidebar2").css("max-width", "70%");
    $(".omissionPlaceDiv").css("left", "auto");
    $(".omissionPlaceDiv").css("right", "10%");
    $(".myro2-multibtndiv-modal").css("top", "100px");
  } else {
    $(".myro-msidebar2").css("max-width", "90%");
    $(".omissionPlaceDiv").css("left", "auto");
    $(".omissionPlaceDiv").css("right", "10%");
    $(".myro2-multibtndiv-modal").css("top", "105px");
  }

  $(".myro-msidebar2").css("position", "absolute");
  $("#msidebar2changeicon").html("fullscreen_exit");
  $(".modalmap-cover").css("margin-left", size2); //    $("#travelDayText").css("padding-left", size3);

  $(".myro2-multibtndiv-modal").css("right", "10px");
  $(".myro2-multibtndiv-modal").css("left", "auto");

  if (reopen) {
    $('#msidebar2Ani').css("width", savedXForOpenPage);
    $('#modalmap-cover').css("margin-left", savedXForOpenPage);
    $('#msidebar2Ani').css("max-width", "65%");
  }
}

function closePlanSideBar() {
  //
  $("#split-bar").remove(); //

  $('#allDayDetailScheduleDiv').css("display", "block");
  $('#msidebar2Ani').css("min-width", "inherit");
  $('#msidebar2Ani').css("max-width", "inherit");
  $(".myro-msidebar2").css("margin-left", "0");

  if ($(window).width() <= 1600) {
    $(".myro-msidebar2").css("width", "235px");
  } else {
    $(".myro-msidebar2").css("width", "265px");
  }

  $(".myro-msidebar2").css("position", "relative");
  $("#msidebar2changeicon").html("fullscreen"); //    $("#msidebar2btnbox").css("width", "100%");
  //    $("#msidebar2btnbox").removeClass("s-border-right");

  $(".modalmap-cover").css("margin-left", "0"); //    $("#travelDayText").css("padding-left", "0");

  $(".myro2-multibtndiv-modal").css("right", "auto");

  if ($(window).width() <= 1600) {
    $(".myro2-multibtndiv-modal").css("left", "290px");
  } else {
    $(".myro2-multibtndiv-modal").css("left", "360px");
  }

  $(".myro2-multibtndiv-modal").css("top", "40px");
  $(".omissionPlaceDiv").css("left", "450px");
  $(".omissionPlaceDiv").css("right", "auto");
} // Get the modal


var modal2 = document.getElementById('userGuideModalPage2'); // When the user clicks anywhere outside of the modal, close it

window.onclick = function (event) {
  if (event.target == modal2) {
    modal2.style.display = "none";
  }
};

var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function currentDiv(n) {
  showDivs(slideIndex = n);
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("mySlidesG2");
  var dots = document.getElementsByClassName("demo2");

  if (n > x.length) {
    slideIndex = 1;
  }

  if (n < 1) {
    slideIndex = x.length;
  }

  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }

  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace("w3-white", "");
  }

  if (x[slideIndex - 1].style) {
    x[slideIndex - 1].style.display = "block";
  }

  if (dots[slideIndex - 1]) {
    dots[slideIndex - 1].className += "w3-white";
  }
}

copyRouteTokenBtnT;

function modifyModeActivate() {
  $("#remakeRouteButton").removeClass("disabled");
  $("#remakeRouteButton").addClass("pulse");
  $("#restoreRouteButton").removeClass("disabled");
  $("#saveButton").addClass("disabled");
  $("#getScheduleFileByExcelBtnT").addClass("disabled");
  $("#copyRouteTokenBtnT").addClass("disabled");
  $("#saveButton").removeClass("pulse");
  $("#travelDayText").css("display", "block");
}

function modifyModeDeActivate() {
  $("#remakeRouteButton").addClass("disabled");
  $("#remakeRouteButton").removeClass("pulse");
  $("#restoreRouteButton").addClass("disabled");
  $("#saveButton").removeClass("disabled");
  $("#getScheduleFileByExcelBtnT").removeClass("disabled");
  $("#copyRouteTokenBtnT").removeClass("disabled");
  $("#saveButton").addClass("pulse");
  $("#travelDayText").css("display", "block");
}

function showLoading(text) {
  $("#loadingText").html("");
  var loadingText = 'LOADING...';

  if (text) {
    loadingText = text;
  }

  for (var i = 0; i < loadingText.length; i++) {
    $("#loadingText").append('<label>&nbsp' + loadingText[i] + '</label>');
  }

  var inputs = $(".progress-container").find($("label"));

  for (var _i13 = 0; _i13 < inputs.length; _i13++) {
    var index = _i13 + 1;
    var time = (inputs.length - _i13) * 20;
    $(".progress-container label:nth-child(" + index + ")").css("-webkit-animation", "anim 3s " + time + "ms infinite ease-in-out");
    $(".progress-container label:nth-child(" + index + ")").css("-animation", "anim 3s " + time + "ms infinite ease-in-out");
  }

  $('#loading').show();
}

function hideLoading() {
  $('#loading').hide();
} //피드백 전송


function postFeedback() {
  var reqParam = {};
  var reqData = {};
  reqParam.name = $("#feedbackName").val();
  reqParam.email = $("#feedbackEmail").val();
  reqParam.feedback = $("#feedback").val();

  if (reqParam.name.length > 22 || reqParam.feedback.length > 1010 || reqParam.email.length > 100) {
    return;
  }

  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (reqParam.email != "" && !re.test(reqParam.email)) {
    showToastMsg(i18nSvc.get('wrongEmailFormat'));
    return;
  }

  if (reqParam.feedback == "") {
    showToastMsg(i18nSvc.get('insertYourFeedback'));
    return;
  }

  reqData.data = JSON.stringify(reqParam);
  showLoading();
  $.ajax({
    type: 'POST',
    url: headAddress + '/postFeedback',
    data: reqData,
    success: function success(res) {
      $("#feedbackName").val("");
      $("#feedbackEmail").val("");
      $("#feedback").val("");
      document.getElementById('modalFeed').style.display = 'none';
      showToastMsg(res);
    },
    fail: function fail() {
      showToastMsg(i18nSvc.get('failToPostFeedback'));
    },
    complete: function complete() {
      hideLoading();
    }
  });
} //trackingData에 유저액션 누적


function addUserTrackingData(action) {
  trackingData += durationSec + '|' + action + ' || ';
} //윈도우 종료시 유저 트래킹 발송


$(window).on("beforeunload", function () {
  var reqParam = {};
  var reqData = {};
  reqParam.trackingData = trackingData;
  reqData.data = JSON.stringify(reqParam);
  $.ajax({
    type: 'POST',
    url: headAddress + '/postUserAct',
    data: reqData,
    success: function success(res) {},
    fail: function fail() {},
    complete: function complete() {}
  });
});

function showRegisterMenu() {
  document.getElementById('reqSpotReg').style.display = 'block';
  $("#reqSpotRegName").focus();
  addUserTrackingData('showRegisterMenu');
}

function hideRegisterMenu() {
  document.getElementById('reqSpotReg').style.display = 'none';
  addUserTrackingData('hideRegisterMenu');
}

function showAllmenuHelp() {
  document.getElementById('userGuideModalPage2').style.display = 'block';
  addUserTrackingData('showAllmenuHelp');
}

function hideAllmenuHelp() {
  document.getElementById('userGuideModalPage2').style.display = 'none';
  addUserTrackingData('hideAllmenuHelp');
}

function showModifyHelp() {
  document.getElementById('userGuideModalPage2').style.display = 'block';
  currentDiv(6);
  addUserTrackingData('showModifyHelp');
}

function hideModifyHelp() {
  document.getElementById('userGuideModalPage2').style.display = 'none';
  addUserTrackingData('hideModifyHelp');
}

function showFeedbackMenu() {
  document.getElementById('modalFeed').style.display = 'block';
  addUserTrackingData('showFeedbackMenu');
}

function hideFeedbackMenu() {
  document.getElementById('modalFeed').style.display = 'none';
  addUserTrackingData('hideFeedbackMenu');
}

function hideFeedBackActionbtn() {
  document.getElementById('FeedBackActionbtnWrapDiv').style.display = 'none';
  addUserTrackingData('hideFeedBackActionbtn');
}

function hideEmailSendMenu() {
  document.getElementById('save').style.display = 'none';
  addUserTrackingData('hideEmailSendMenu');
}

function hideRoutePage() {
  document.getElementById('routepage').style.display = 'none';
  $('html, body').css({
    'overflow': 'auto',
    'height': '100%'
  });
  seeAllDaySchedule();

  if ($(window).width() <= 600) {
    mobileEditScheduleBool = true;
    mobileEditSchedule();
  }

  addUserTrackingData('hideRoutePage');
} //가이드 페이지 팝업
//function openGuidepageAfterMakeroute() {
//    if ($.cookie("ifDontseeAgainGuidepageAfterMakeroute") != "Y") {
//        document.getElementById('guidepageAfterMakeroute').style.display = 'block';
//        $("#toastToRegisterSpots").css("display", "none");
//    }
//}
//
//function hideGuidepageAfterMakeroute() {
//    document.getElementById('guidepageAfterMakeroute').style.display = 'none';
//    if ($("[name=ifDontseeAgainGuidepageAfterMakeroute]")[0].checked == true) {
//        $.cookie("ifDontseeAgainGuidepageAfterMakeroute", "Y", 7);
//    }
//
//    addUserTrackingData('hideguidepageAfterMakeroute');
//}
//
//function openGuidepage() {
//    if ($.cookie("ifDontseeAgainGuidepageAfterMakeroutemain") != "Y") {
//        document.getElementById('guidepageAfterMakeroutemain').style.display = 'block';
//    }
//}
//
//function hideGuidepage() {
//    document.getElementById('guidepageAfterMakeroutemain').style.display = 'none';
//    if ($("[name=ifDontseeAgainGuidepageAfterMakeroutemain]")[0].checked == true) {
//        $.cookie("ifDontseeAgainGuidepageAfterMakeroutemain", "Y", 7);
//    }
//    addUserTrackingData('hideguidepageAfterMakeroutemain');
//}


function openYoutubeGuidePage() {
  window.open('https://www.youtube.com/watch?v=KD5rhdHhtyg', '_blank');
  addUserTrackingData('openYoutubeGuidePage');
}

function finishMobileDatePick() {
  $(".selectCardCss").css("display", "block");
  $('.myro-sidebar-wrap').css("display", "block");
  $('.myro-sidebar').css("height", "100%"); //    $(".myro-sidebar").css("top", "unset");
  //    $(".myro-sidebar").css("background-color", "#ffffff");

  $(".myro-sidebar").css("z-index", "9999"); //    $('.collapsible').collapsible('close');
  //    $("#finishMobileDatePickBtn").css("display", "none");
  //    $(".datepickMobileViewbox").css("display", "block");
  //    $(".datepickMobileViewboxwrap").css("display", "block");
}

function finishMobileDatePickRedirect() {
  $(".selectCardCss").css("display", "none");
  $('.myro-sidebar-wrap').css("display", "none"); //    $(".myro-sidebar").css("position", "absolute");

  $('.myro-sidebar').css("height", "85px"); //    $(".myro-sidebar").css("top", "0");
  //    $(".myro-sidebar").css("background-color", "transparent");

  $(".myro-sidebar").css("z-index", "999");
  $('.collapsible').collapsible('close'); //    $('.collapsible').collapsible('open');
  //    $("#finishMobileDatePickBtn").css("display", "block");
  //    $(".datepickMobileViewbox").css("display", "none");
  //    $(".datepickMobileViewboxwrap").css("display", "none");
}

function searchSpotKeywordFocus() {
  if ($(window).width() <= 600) {
    finishMobileDatePickRedirect();
  }

  $("[name=searchSpotOrHotelRadio]")[1].checked = true;
  $("#searchSpotOrHotelKeyword").focus();
  $(".search-sidebar").addClass("heartbeat");
  setTimeout(function () {
    $(".search-sidebar").removeClass("heartbeat");
  }, 1500);
  $("#searchOrRecommend").html(i18nSvc.get('searchPlacePlease'));
  $("#searchResultCnt").html("");
  $("#searchSpotOrHotelKeyword").val("");
  $("#pageSectionDiv").css("display", "none");
  $("#spotsNoListText").css("display", "block");
  $("#pageList").html("");
  deleteAllSpotsList();
}

function searchHotelKeywordFocus(hotelDayRadioBtnIdx) {
  if ($(window).width() <= 600) {
    finishMobileDatePickRedirect();
  }

  $("[name=searchSpotOrHotelRadio]")[0].checked = true;
  $("#searchSpotOrHotelKeyword").focus();
  $(".search-sidebar").addClass("heartbeat");
  setTimeout(function () {
    $(".search-sidebar").removeClass("heartbeat");
  }, 1500);
  $("#searchOrRecommend").html(i18nSvc.get('searchHotelPlease'));
  $("#searchResultCnt").html("");
  $("#searchSpotOrHotelKeyword").val("");
  $("#pageSectionDiv").css("display", "none");
  $("#spotsNoListText").css("display", "block");
  $("#pageList").html("");

  if (!hotelDayRadioBtnIdx) {
    hotelDayRadioBtnIdx = 0;

    for (var i = 0; i < travelDay; i++) {
      if (!selectedHotels[i]) {
        hotelDayRadioBtnIdx = i;
        break;
      }
    }
  }

  $('input[name="hotelDay"]')[hotelDayRadioBtnIdx].checked = true;
  deleteAllSpotsList();
} //메모장 open & close 시작 (LSH)


function showSpotMemoDiv(no) {
  $("#SpotMemoDiv" + no).css("display", "block");
  $("#SpotMemoOpen" + no).css("display", "none");
}

function closeSpotMemoDiv(no) {
  $("#SpotMemoDiv" + no).css("display", "none");
  $("#SpotMemoOpen" + no).css("display", "block");
} //메모장 open & close 끝 (LSH)


function HelpToast(text) {
  showToastMsg(text);
}

;

function openDailyTimesSettingArea() {
  $('.collapsible').collapsible('open');

  if ($(window).width() <= 600) {
    $(".myro-sidebar").css("height", "80%");
    $(".myro-sidebar").css("z-index", "9999");
  }
}

function closeDailyTimesSettingArea() {
  $('.collapsible').collapsible('close');

  if ($(window).width() <= 600) {
    $(".myro-sidebar").css("height", "85px");
    $(".myro-sidebar").css("z-index", "999");
  }
}

var mobileEditScheduleBool = false;

var mobileEditSchedule = function mobileEditSchedule() {
  if (mobileEditScheduleBool == false) {
    mobileEditScheduleBool = true;
    $("#msidebar2btnbox").css("display", "block");
    $("#mobileDetailRouteDiv").css("display", "block");

    if ($(window).width() <= 375) {
      $(".modalmap-cover").css("height", "55vh");
    } else {
      $(".modalmap-cover").css("height", "45vh");
    } //        $("#mobileEditControlIcon").css("transform", "rotate(180deg)");


    $("#mobileEditControlBtn").css("display", "block");
    $("#mobileEditControlBtnBottom").css("display", "none");
  } else {
    mobileEditScheduleBool = false;
    $("#msidebar2btnbox").css("display", "none");
    $("#mobileDetailRouteDiv").css("display", "none");
    $(".modalmap-cover").css("height", "100vh"); //        $("#mobileEditControlIcon").css("transform", "none");

    $("#mobileEditControlBtn").css("display", "none");
    $("#mobileEditControlBtnBottom").css("display", "block");
  }
}; /////////////////////////////////////////////추천장소 엘리 작업중
// When the user clicks anywhere outside of the modal, close it


window.onclick = function (event) {
  var modalHS = document.getElementById('HotSpotModalPage');

  if (event.target == modalHS) {
    modalHS.style.display = "none";
  }
};

var slideIndexHS = 1;

function plusDivsHS(n) {
  showDivshs(slideIndexHS += n);
}

function currentDivHS(n) {
  showDivshs(slideIndexHS = n);
}

function showDivshs(n) {
  var i;
  var h = document.getElementsByClassName("mySlidesHS");
  var dotshs = document.getElementsByClassName("demo3");

  if (n > h.length) {
    slideIndexHS = 1;
  }

  if (n < 1) {
    slideIndexHS = h.length;
  }

  for (i = 0; i < h.length; i++) {
    h[i].style.display = "none";
  }

  for (i = 0; i < dotshs.length; i++) {
    if ($(window).width() <= 600) {
      dotshs[i].className = dotshs[i].className.replace("w3-white", "");
    } else {
      dotshs[i].className = dotshs[i].className.replace(" w3-dark-grey", "");
    }
  }

  if (h[slideIndexHS - 1]) {
    h[slideIndexHS - 1].style.display = "block";
  }

  if (dotshs[slideIndexHS - 1]) {
    if ($(window).width() <= 600) {
      dotshs[slideIndexHS - 1].className += " w3-white";
    } else {
      dotshs[slideIndexHS - 1].className += " w3-dark-grey";
    }
  }

  $("#recommendedCourseAreaCurrent").html("&nbsp(" + slideIndexHS + "/" + i + ")"); //가장 많이 선택

  if (slideIndexHS == 1) {
    $.ajax({
      type: 'GET',
      url: headAddress + '/searchMostSelectedSpots',
      data: {
        cityName: cityName
      },
      success: function success(mostSelectedSpots) {
        searchedSpotsListFromRecommendedCourse = mostSelectedSpots;
        makeRecommendedcoursePage(slideIndexHS, searchedSpotsListFromRecommendedCourse, "", 'hs001.jpeg');
      }
    });
  } //그외 추천 일정
  else {
      if (recommendedcoursesNo.length > 0) {
        $.ajax({
          type: 'GET',
          url: headAddress + '/searchSpotsWithRecommendedcourseNo',
          data: {
            recommendedcourseNo: recommendedcoursesNo[slideIndexHS - 2].no,
            cityName: cityName
          },
          success: function success(courseInfo) {
            searchedSpotsListFromRecommendedCourse = courseInfo.searchedSpots;
            makeRecommendedcoursePage(slideIndexHS, searchedSpotsListFromRecommendedCourse, courseInfo.courseName, courseInfo.imgName);
          }
        });
      }
    }

  function makeRecommendedcoursePage(n, spots, courseName, imgName) {
    var appendingTxt = "";
    $("#recommendedcourses" + (n - 1)).html("");
    $("[id^='chipNo']").remove();
    $("[id^='miNo']").remove();
    var star = 0,
        sumOfStayingTimeToSpots = 0;

    for (var _i14 = 0; _i14 < searchedSpotsListFromRecommendedCourse.length; _i14++) {
      star += searchedSpotsListFromRecommendedCourse[_i14].selectedCnt;
      sumOfStayingTimeToSpots += searchedSpotsListFromRecommendedCourse[_i14].recommendedStaySec;
    }

    sumOfStayingTimeToSpots = Math.floor(sumOfStayingTimeToSpots / 3600);
    appendingTxt += '<div class="row">' + '<div class="col s12" style="padding:0.9rem;padding-top: 0;">' + '<div class="card z-depth-2 m-borderBold" style="margin:0 0 1rem 0">' + '<div class="card-image">' + '<img src="/myro_image/recommendedCourseBackground/' + imgName + '" alt="image">' + '<div class="spotphotolinear_large">' + '<span class="card-title" style="text-align: center;width:100%;letter-spacing: 0.1rem;">' + '<b class="rccourseName">' + courseName + '</b><br>' + '<span class="rccourseMI"><i class="material-icons" style="vertical-align:-2px;font-size:14px;color:#FF0000">place</i><h7>' + searchedSpotsListFromRecommendedCourse.length + '</h7>' + '<i class="material-icons" style="vertical-align:-2px;margin-left:2%;font-size:14px;color:cyan">access_time</i><h7>' + sumOfStayingTimeToSpots + 'h</h7>' + '<i class="material-icons" style="vertical-align:-2px;margin-left:2%;font-size:14px;color:#ffc107">star</i><h7>' + star + '</h7></span>' + '</span></div>' + '<a title="' + i18nSvc.get('selectAll') + '" class="btn-floating halfway-fab waves-effect waves-light red accent-3 pulse RecommendAllbtnbottom" onClick="setRecommendedCourseOnCart()"><i class="material-icons">pin_drop</i></a>' + '</div>' + '<div class="RecommendCourseNotice" style="text-align: center;width:100%;"><hs style="color:#ffc107">' + i18nSvc.get('guideForRecommendedCourse') + '</hs></div>' + '<div class="card-content RCCCS" style="padding:15px 10px 10px 10px">';

    for (var _i15 = 0; _i15 < searchedSpotsListFromRecommendedCourse.length; _i15++) {
      var spotOrRestaurant = void 0;

      if (searchedSpotsListFromRecommendedCourse[_i15].isSpot == 1) {
        //장소
        spotOrRestaurant = 'account_balance';
      } else if (searchedSpotsListFromRecommendedCourse[_i15].isSpot == 0) {
        //식당
        spotOrRestaurant = 'restaurant';
      }

      var showingNameForReccomendedcourse = searchedSpotsListFromRecommendedCourse[_i15].showingName;

      if (showingNameForReccomendedcourse.indexOf('(') != -1) {
        showingNameForReccomendedcourse = showingNameForReccomendedcourse.split("(")[0];
      }

      var chipclass = "chip";

      for (var j = 0; j < selectedSpots.length; j++) {
        if (selectedSpots[j].no == searchedSpotsListFromRecommendedCourse[_i15].no) {
          //chipcss = 'color:#ffffff;background-color:#000000;opacity:0.8';
          chipclass = "chip chipSelectedCss";
          spotOrRestaurant = 'check';
        }
      }

      appendingTxt += '<div id="chipNo' + searchedSpotsListFromRecommendedCourse[_i15].no + '" class="' + chipclass + '"' + 'onclick="addOrRemoveSpotToSelectedSpotsFromRecommendedCourse(' + searchedSpotsListFromRecommendedCourse[_i15].no + ')"><i id="miNo' + searchedSpotsListFromRecommendedCourse[_i15].no + '" class="material-icons" style="font-size:inherit;vertical-align: -1px;">' + spotOrRestaurant + '</i><hs>' + showingNameForReccomendedcourse + '</hs></div>';
    }

    appendingTxt += '</div>' + '</div>' + '</div>' + '</div>';
    $("#recommendedcourses" + (n - 1)).append(appendingTxt);
  }
}

function addOrRemoveSpotToSelectedSpotsFromRecommendedCourse(no) {
  var isAlreadySelected = false;
  var spotOrRestaurant = "account_balance";

  for (var i = 0; i < selectedSpots.length; i++) {
    if (no == selectedSpots[i].no) {
      isAlreadySelected = true;

      if (selectedSpots[i].isSpot == 0) {
        spotOrRestaurant = "restaurant";
      }
    }
  }

  if (isAlreadySelected) {
    removeSpotFromSelectedSpots(no);
    $("#chipNo" + no).removeClass("chipSelectedCss");
    $("#miNo" + no).html(spotOrRestaurant);
  } else {
    addSpotToSelectedSpots(no);
  }
}

function setRecommendedCourseOnCart() {
  for (var i = 0; i < searchedSpotsListFromRecommendedCourse.length; i++) {
    var isAlreadySelected = false;

    for (var j = 0; j < selectedSpots.length; j++) {
      if (searchedSpotsListFromRecommendedCourse[i].no == selectedSpots[j].no) {
        isAlreadySelected = true;
      }
    }

    if (!isAlreadySelected) {
      addSpotToSelectedSpots(searchedSpotsListFromRecommendedCourse[i].no, true);
    }
  }

  document.getElementById('HotSpotModalPage').style.display = "none";
} //////////////////////////////////////////


function showRecommendedcourses() {
  $.ajax({
    type: 'GET',
    url: headAddress + '/getRecommendedcourseNos',
    data: {
      cityName: cityName
    },
    success: function success(nos) {
      $("#recommendedCourseArea").html("");
      recommendedcoursesNo = nos;
      var appendText = "";

      for (var i = 0; i < recommendedcoursesNo.length + 1; i++) {
        appendText += '<div id="recommendedcourses' + i + '" class="mySlidesHS">' + '</div>';
      } //추천일정 없을때 커밍순


      if (recommendedcoursesNo.length == 0) {
        appendText += '<div id="recommendedcourses1" class="mySlidesHS">' + '<div class="row">' + '<div class="col s12" style="padding:0.9rem;padding-top: 0;">' + '<div class="card z-depth-2 m-borderBold">' + '<div class="card-image">' + '<img src="/myro_image/hs000.jpeg" alt="image">' + '<div class="spotphotolinear_large">' + '<span class="card-title" style="font-size:14px;text-align:center;width:100%;letter-spacing: 0.1rem;color:#ffc107;">' + i18nSvc.get('moreRecommendedCourseComingSoon') + '<b style="color:#ffc107;font-size: 30px"></b>' + '</span></div>' + '</div>' + '<div class="card-content"></div></div></div></div></div>';
      }

      appendText += //                '<div class="center container white-text w3-display-bottommiddle" style="width:100%">' +
      //                '<div class="left" style="cursor: pointer;color:#696969;" onClick="plusDivsHS(-1)">&#10094;</div>' +
      //                '<div class="right" style="cursor: pointer;color:#696969;" onClick="plusDivsHS(1)">&#10095;</div>';
      '<div class="hotspotArrowDiv"><div class="left hotspotArrowleft" onClick="plusDivsHS(-1)">&#10094;</div>' + '<div class="right hotspotArrowright" onClick="plusDivsHS(1)">&#10095;</div></div>' + '<div class="center container white-text w3-display-bottommiddle" style="width:100%">';

      for (var _i16 = 0; _i16 < recommendedcoursesNo.length + 1; _i16++) {
        appendText += '<span class="s-badge demo3 w3-transparent w3-hover-gray" style="border:1px solid #696969;margin:0 3px 0 3px" onClick="currentDivHS(' + (_i16 + 1) + ')"></span>';
      } //추천일정 없을때 페이징


      if (recommendedcoursesNo.length == 0) {
        appendText += '<span class="s-badge demo3 w3-transparent w3-hover-gray" style="border:1px solid #696969;margin:0 3px 0 3px" onClick="currentDivHS(2)"></span>';
      }

      appendText += '</div>';
      $("#recommendedCourseArea").append(appendText);
      showDivshs(slideIndexHS);
      document.getElementById('HotSpotModalPage').style.display = 'block';
    }
  });
} //날짜 바꿨을 때 호텔 선택 영역 변경


function changeSelectedHotelAreaWhenChangeDate() {
  //selectedHotels
  removeAllHotelsSelectedSpots();
  selectedHotels = [];
  refreshSeletedHotelsCnt();
  $("[id*=hotelSetDayLabel]").remove(); // 셀렉트호텔데이 표시라벨 전체삭제(LSH)

  $("#cart3").html("");

  for (var i = 0; i < travelDay; i++) {
    var today = new Date(startTravelDate);
    today.setDate(startTravelDate.getDate() + i);
    var startMonth = ("0" + (today.getMonth() + 1)).slice(-2);
    var startDay = ("0" + today.getDate()).slice(-2);
    var weekDay = today.getDay() % 7;

    if (weekDay < 0) {
      weekDay += 7;
    }

    var checked = "";

    if (i == 0) {
      checked = "checked";
    }

    var appendingText = "<div class=\"dayhoteldiv\">\n        <input id=\"day".concat(i, "hotelinput\" class=\"radio-inline__input\" type=\"radio\" name=\"hotelDay\" ").concat(checked, ">\n        <label id=\"day").concat(i, "hotellabelnumber\" class=\"radio-inline__label addRIL\" for=\"day").concat(i, "hotelinput\">\n        <div id=\"dayhotellabeltext\">Day<br><hs class=\"hotelDayCount\">").concat(i + 1, "</hs><br><hs>").concat(startMonth, ".").concat(startDay, "(").concat(weekDayKor[weekDay], ")</hs></div></label>\n    \n        <div class=\"dayhoteldivfirstChild\" id=\"hotelHelpText").concat(i, "\">\n            <div>\n\n                <div class=\"dayhoteldivsecondChild\">\n    \n                </div>\n                <span id=\"day").concat(i, "SelectedhotelInfo\"></span>\n                <span id=\"day").concat(i, "hotelInfo\"><li class=\"center hotelInfoText\">\n                <hs>").concat(i18nSvc.get('selectDateAndChooseHotel'), "</hs><br><i style =\"cursor: pointer\" class=\"material-icons\" onclick=\"searchHotelKeywordFocus(").concat(i, ")\">add</i></li></span>\n              </div>\n        </div>\n        </div>");
    $("#cart3").append(appendingText);
  }
} // 액션 선언 & validation 등


$("#reqSpotRegName").on('input', function () {
  if ($("#reqSpotRegName").val().length > 100) {
    $("#reqSpotRegName").val($("#reqSpotRegName").val().substr(0, 100));
  }
});
$("#reqSpotRegDesc").on('input', function () {
  if ($("#reqSpotRegDesc").val().length > 200) {
    $("#reqSpotRegDesc").val($("reqSpotRegDesc").val().substr(0, 200));
  }
});
$("#feedbackName").on('input', function () {
  if ($("#feedbackName").val().length > 20) {
    $("#feedbackName").val($("#feedbackName").val().substr(0, 20));
  }
});
$("#feedbackEmail").on('input', function () {
  if ($("#feedbackEmail").val().length > 100) {
    $("#feedbackEmail").val($("#feedbackEmail").val().substr(0, 100));
  }
});
$("#feedback").on('input', function () {
  if ($("#feedback").val().length > 1000) {
    $("#feedback").val($("#feedback").val().substr(0, 1000));
  }
});
$("#feedbackName").keyup(function (event) {
  if (event.keyCode == 13) {
    $("#feedbackEmail").focus();
  }
});
$("#feedbackEmail").keyup(function (event) {
  if (event.keyCode == 13) {
    $("#feedback").focus();
  }
});
$("#FeedBackActionbtn").hover(function () {
  //호버될때
  setTimeout(function () {
    $("#FeedBackActionbtnText").html(i18nSvc.get('sendUsYourFeedback'));
  }, 2);
}, function () {
  //호버빠질때
  $("#FeedBackActionbtnText").html(i18nSvc.get('doYouHaveSomeProblems'));
});
$("[name=searchSpotOrHotelRadio]").click(function () {
  deleteAllSpotsList();
  $("#pageList").html("");
  $("#pageSectionDiv").css("display", "none");
  $("#spotsNoListText").css("display", "block"); //장소나 호텔 버튼 클릭하면 페이지 안넘어가게 임시방편

  pageNumForNextPage = 0;
  lastPage = 1;

  if ($("[name=searchSpotOrHotelRadio]")[0].checked == true) {
    $("#searchOrRecommend").html(i18nSvc.get('searchHotelPlease'));
    addUserTrackingData('changeHorSRadioButton|' + 'hotel');
  } else if ($("[name=searchSpotOrHotelRadio]")[1].checked == true) {
    $("#searchOrRecommend").html(i18nSvc.get('searchPlacePlease'));
    addUserTrackingData('changeHorSRadioButton|' + 'spot');
  }

  $("#searchResultCnt").html("");
  $("#searchSpotOrHotelKeyword").val("");
  $("#searchSpotOrHotelKeyword").focus();
}); //엔터 누르면 버튼 눌리게

$("#searchSpotOrHotelKeyword").keyup(function (event) {
  if (event.keyCode == 13) {
    $("#searchSpotsOrHotelsButton").click();
  }
});
$("#searchSpotKeywordAfterMakeRoute").keyup(function (event) {
  if (event.keyCode == 13) {
    $("#searchSpotsAfterMakeRouteButton").click();
  }
});
$("#emailName").keyup(function (event) {
  if (event.keyCode == 13) {
    $("#saveRouteAndSendEmailButton").click();
  }
});
$("input[name*='emailAddress']").keyup(function (event) {
  if (event.keyCode == 13) {
    $("#saveRouteAndSendEmailButton").click();
  }
});
$("#reqSpotRegName").keyup(function (event) {
  if (event.keyCode == 13) {
    $("#reqSpotRegBtn").click();
  }
});
$("#reqSpotRegDesc").keyup(function (event) {
  if (event.keyCode == 13) {
    $("#reqSpotRegBtn").click();
  }
}); //엔터 누르면 버튼 눌리게
// 장소등록 시작 //

function getInformationFromGoogleAndShowRegistrationModal(cnt) {
  var reqSpotRegName = $('#reqSpotRegName').val();

  if (reqSpotRegName == "") {
    showToastMsg(i18nSvc.get('insertPlaceName'));
    return;
  }

  var lat = startLat,
      lng = startLng;

  if (cnt == 0) {} else if (cnt == 1) {
    lat += 0.4;
    lng += 0.6;
  } else if (cnt == 2) {
    lat += 0.4;
    lng -= 0.6;
  } else if (cnt == 3) {
    lat -= 0.4;
    lng += 0.6;
  } else if (cnt == 4) {
    lat -= 0.3;
    lng -= 0.5;
  } else {
    showToastMsg(i18nSvc.get('noSearchResult'));
    $('#reqSpotRegName').focus();
    return;
  }

  $.ajax({
    url: headAddress + "/getPlaces?sk=" + reqSpotRegName + "&lat=" + lat + "&lng=" + lng + "&radius=" + 50000,
    success: function success(data) {
      searchInfoForRegSpot = JSON.parse(data.body).results;

      if (searchInfoForRegSpot.length == 0) {
        getInformationFromGoogleAndShowRegistrationModal(cnt + 1);
        return;
      }

      $("#reqSearchSpotReg").css("display", "block");
      $("#searchInfoForRegSpotCnt").html(searchInfoForRegSpot.length);
      $("#searchInfoForRegSpotResult").html("");

      for (var i = 0; i < searchInfoForRegSpot.length; i++) {
        var _spot8 = searchInfoForRegSpot[i];
        var appendTxt = "<li class=\"collection-item rSSRstyle1\">\n                   \n                    <div style=\"display: flex\">\n                       \n                        <!-- \uAC80\uC0C9\uC7A5\uC18C\uC815\uBCF4\uC774\uB984/\uC8FC\uC18C Div -->\n                        <div class=\"rSSRstyle2\">\n                            <h7>".concat(_spot8.name, "</h7><br>\n                            <hs>").concat(_spot8.vicinity, "</hs>\n                        </div>\n\n                        <!-- \uAC80\uC0C9\uC7A5\uC18C\uBC84\uD2BC Div -->\n                        <div class=\"reqSpotRegBtnWrap\" >\n\n                            <div title=\"").concat(i18nSvc.get('registerThisPlace'), "\" class=\"btn waves-effect reqSpotRegBtnAdd\" onclick=\"reqSpotReg(").concat(i, ")\"><i class=\"material-icons\">add</i></div>\n                            <div title=\"").concat(i18nSvc.get('watchInGoogleMap'), "\" class=\"btn waves-effect reqSpotRegBtnSearch\" onclick=\"searchInWeb('google', '").concat(_spot8.name, "', '").concat(_spot8.geometry.location.lat, "', '").concat(_spot8.geometry.location.lng, "')\"><i class=\"material-icons\">search</i></div>\n\n                        </div>\n\n                    </div>\n                </li>");
        $("#searchInfoForRegSpotResult").append(appendTxt);
      }
    }
  });
}

function reqSpotReg(idx) {
  var reqSpotRegName = $('#reqSpotRegName').val();
  var reqSpotRegDesc = $('#reqSpotRegDesc').val();
  var spotOrHotel = 'spot';

  if ($("[name=spotOrHotelForRegisterSpot]")[1].checked == true) {
    spotOrHotel = 'restaurant';
  } else if ($("[name=spotOrHotelForRegisterSpot]")[2].checked == true) {
    spotOrHotel = 'hotel';
  }

  var searchedInfoInGoogle = searchInfoForRegSpot[idx];
  var spots = [];
  var spot = {};
  spot.type = searchedInfoInGoogle.types;
  spot.googleSearchedName = searchedInfoInGoogle.name;
  spot.reqSpotRegName = reqSpotRegName;
  spot.reqSpotRegDesc = reqSpotRegDesc;
  spot.lat = searchedInfoInGoogle.geometry.location.lat;
  spot.lng = searchedInfoInGoogle.geometry.location.lng;
  spot.recommendedStaySec = 7200;
  spot.address = searchedInfoInGoogle.vicinity;
  spot.place_id = searchedInfoInGoogle.place_id;
  spot.showingName = searchedInfoInGoogle.name;
  spot.searchingEname = "";
  spot.searchingKname = "";
  spot.spotOrHotel = spotOrHotel;
  spot.cityName = cityName;
  var korCheck = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  var engCheck = /[a-z]|[A-Z]/;

  if (!korCheck.test(reqSpotRegName)) {
    spot.searchingEname = reqSpotRegName;

    if (!engCheck.test(spot.googleSearchedName)) {
      spot.showingName = spot.googleSearchedName + "(" + spot.searchingEname + ")";
    }
  }

  if (!engCheck.test(reqSpotRegName)) {
    spot.searchingKname = reqSpotRegName;

    if (!korCheck.test(spot.googleSearchedName)) {
      spot.showingName = spot.searchingKname + "(" + spot.googleSearchedName + ")";
    }
  }

  if (searchedInfoInGoogle.photos) {
    spot.photo_reference = searchedInfoInGoogle.photos[0].photo_reference;
  } else {
    spot.photo_reference = "";
  }

  spots.push(spot);
  var reqParam = {};
  reqParam.spots = JSON.stringify(spots);
  $.ajax({
    type: 'POST',
    url: headAddress + "/insertSpotOrHotel",
    data: reqParam,
    success: function success(data) {
      if (data == "inserted" || data == "updated") {
        showToastMsg(i18nSvc.get('placeRegisterComplete'));
        $("#reqSearchSpotReg").css("display", "none");
        $("#reqSpotReg").css("display", "none");
        $('#reqSpotRegName').val("");
        $('#reqSpotRegDesc').val("");
      } else {
        showToastMsg(i18nSvc.get('placeRegisterError'));
      }
    }
  });
  addUserTrackingData('reqSpotReg|' + spotOrHotel + '|' + reqSpotRegName);
}

; // 장소등록 끝 //

function openEventPage() {
  window.open("/myro_image/event.jpg");
}

function sendInflowChannel() {
  var checkBoxses = $("[name=channelSelectBox]");
  var checkorder = "";

  for (var i = 0; i < checkBoxses.length; i++) {
    if (checkBoxses[i].checked) {
      checkorder += i + ",";
    }
  }

  var reqParam = {};
  reqParam.checkorder = checkorder;
  reqParam.channelEtcReason = $("#channelEtcReason").val();
  $.ajax({
    type: 'POST',
    url: headAddress + "/postInflowchannel",
    data: reqParam,
    success: function success() {
      document.getElementById('modalInflowWrap').style.display = 'none';
      showToastMsg(i18nSvc.get('thanksForHelpUs'));
    }
  });
}