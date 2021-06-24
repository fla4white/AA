"use strict";

//JS용 언어팩
var i18nSvc = {},
    i18n = {};

i18nSvc.get = function (keyword) {
  return i18n.dictionary[keyword][lang];
};

i18n.dictionary = {
  closePannel: {
    ko: "검색창 닫기",
    en: "close pannel"
  },
  openPannel: {
    ko: "검색창 열기",
    en: "open pannel"
  },
  weekDays: {
    ko: ["일", "월", "화", "수", "목", "금", "토"],
    en: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  },
  recommendedHotels: {
    ko: "추천호텔",
    en: "recommended hotels"
  },
  recommendedSpots: {
    ko: "추천장소",
    en: "recommended spots"
  },
  searchedResult: {
    ko: "검색결과",
    en: "searched result"
  },
  moreThanTwoLettersForSearchingKeyword: {
    ko: "검색어는 두 글자 이상 입력해주세요",
    en: "searching keyword should be longer than two letters"
  },
  moreThan15Results: {
    ko: "검색 결과가 15건을 초과하여 상위 15건만 표시됩니다.<br> 정확한 검색을 위해 검색어를 더욱 구체적으로 입력해 주시기 바랍니다.",
    en: "There are more than 15 results, so you can see only 15 results.<br> Please, specify your keyword."
  },
  noSearchResult: {
    ko: "검색 결과가 없습니다",
    en: "There is no search result"
  },
  resultCnt: {
    ko: "건",
    en: ""
  },
  restaurant: {
    ko: "식당",
    en: "restaurant"
  },
  spot: {
    ko: "장소",
    en: "spot"
  },
  hotel: {
    ko: "호텔",
    en: "hotel"
  },
  selectPlace: {
    ko: "선택목록 장소에 추가",
    en: "select Place"
  },
  searchAtGoogle: {
    ko: "구글에서 검색",
    en: "search at google"
  },
  placeName: {
    ko: "장소명",
    en: "place name"
  },
  address: {
    ko: "주소",
    en: "address"
  },
  addPlace: {
    ko: "장소추가",
    en: "add place"
  },
  addSpotToOmittedPlaces: {
    ko: "포함되지 않은 장소에 추가",
    en: "add place to omitted place list"
  },
  selectHotel: {
    ko: "선택목록 호텔에 추가",
    en: "select hotel"
  },
  checkStayingDate: {
    ko: "숙박 일자를 확인해주세요",
    en: "check your staying date"
  },
  setYourTravelDate: {
    ko: "여행 일수를 입력해주세요",
    en: "set your travel date"
  },
  cantChooseMoreThan8PlacesPerDayForAverage: {
    ko: "하루당 평균 8장소 이상 선택 불가",
    en: "you can't choose more than 8 places for average per day"
  },
  isAlreadySelected: {
    ko: "은(는) 이미 선택하신 장소입니다.",
    en: "is already selected"
  },
  sumOfStayingTimeOfPlacesCannotBeGreaterThanTotalTravelTime: {
    ko: "여행 총 시간보다 장소에서의 총 소요시간이 클 수 없습니다.",
    en: "sum of staying time of all places can't be greater than your total travel time"
  },
  stayingTime: {
    ko: "머무는 시간",
    en: "staying time"
  },
  removeFromSelectedList: {
    ko: "목록에서 삭제",
    en: "remove from selected list"
  },
  hours: {
    ko: "시간",
    en: "hour"
  },
  min: {
    ko: "분",
    en: "min"
  },
  youShouldSelectHotel: {
    ko: "호텔을 선택하셔야 합니다",
    en: "please, select your hotel"
  },
  travelDayShouldBeGreaterThanSelectedPlaces: {
    ko: "여행 일수보다 장소 수가 적을 수 없습니다",
    en: "travel day should be greater than selected places"
  },
  planModifed: {
    ko: "일정이 수정되었습니다",
    en: "your plan has been modified"
  },
  planModificationCanceld: {
    ko: "일정 수정이 취소되었습니다",
    en: "your modification is canceld"
  },
  notIncludedPlaces: {
    ko: "포함되지 않은 장소",
    en: "not included places"
  },
  placesOutOfPlanIsHere: {
    ko: "일정에서 누락된 장소들이 이곳에 포함됩니다.",
    en: "places not included in the plan are here"
  },
  youCanDragYourPlacesHere: {
    ko: "일정에 포함된 장소를 옮겨 놓을 수도 있습니다.",
    en: "you can move places included in the plan here too"
  },
  dragPlacesAndMoveToWhereYouWant: {
    ko: "원하는 위치에 드래그하여 일정에 포함시키세요",
    en: "drag and drop the places where you want"
  },
  monthList: {
    ko: ["", "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
    en: ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  },
  whatDay: {
    ko: "일",
    en: "th"
  },
  canChangeDay: {
    ko: "일차를 누르면 일정 전체 변경이 가능합니다.",
    en: "you can change the whole day with another"
  },
  depart: {
    ko: "출발",
    en: "depart"
  },
  closed: {
    ko: "휴무",
    en: "closed"
  },
  duration: {
    ko: "소요시간",
    en: "duration"
  },
  start: {
    ko: "시작",
    en: "start"
  },
  end: {
    ko: "종료",
    en: "end"
  },
  timeTable: {
    ko: "시간표",
    en: "time table"
  },
  openHours: {
    ko: "영업시간",
    en: "open hours"
  },
  clickAndDrag: {
    ko: "클릭하여 이동",
    en: "click and drag"
  },
  canPutShortMemo: {
    ko: "필요시 메모를 입력하세요\n(최대 100자)",
    en: "you can put a short memo"
  },
  scheduleProblem: {
    ko: "일정에 문제가 있습니다. 빨간색으로 표시된 시간표를 확인해주세요",
    en: "some problem on your schedule. check the red time table"
  },
  sureToRemove: {
    ko: "정말 삭제하시겠습니까? ",
    en: "are you sure to remove?"
  },
  atLeastOnePlace: {
    ko: "하루에 최소한 한개의 일정이 필요합니다",
    en: "need at least one place per day"
  },
  waitCreatingTravelPlan: {
    ko: "마이로가 세상에 없던 당신만의 여행 일정을 생성중입니다. 잠시만 기다려주세요",
    en: "MYRO is creating an unique travel plan for you. Please wait a moment"
  },
  failToMakePlan: {
    ko: "일정 생성 실패",
    en: "fail to make plan"
  },
  route: {
    ko: "상세경로",
    en: "route"
  },
  estimatedDuration: {
    ko: "예상 소요시간",
    en: "estimated duration"
  },
  cantFindRouteOnGoogleMap: {
    ko: "죄송합니다. 구글지도에서 해당 장소간 경로를 제공하지 않습니다",
    en: "sorry. google map doesn't provide the route"
  },
  day: {
    ko: "일차",
    en: "day"
  },
  month: {
    ko: "월",
    en: "month"
  },
  wrongEmailFormat: {
    ko: "잘못된 메일 형식입니다",
    en: "wring email format"
  },
  atLeastOneEmail: {
    ko: "이메일을 최소한 한개 입력하세요",
    en: "please insert one email at least "
  },
  modifiedScheduleSaved: {
    ko: "수정된 일정이 저장되었습니다",
    en: "your modification has been applied"
  },
  maximumTenEmail: {
    ko: "Email은 한번에 최대 10개까지 발송할 수 있습니다.",
    en: "you can send maximum 10 email at once"
  },
  registerPlaceIfNotExists: {
    ko: "찾으시는 장소가 없으면 장소등록요청을 해주세요",
    en: "if the place you are searching doesn't exist, please add the place"
  },
  googleDoesntProvideGooglemapTransitMode: {
    ko: "이 도시에서 google 대중교통을 사용할 수 없습니다",
    en: "google map doens't provide google map transit mode in this city"
  },
  googleDoesntProvideGooglemapDrivingMode: {
    ko: "이 도시에서 google driving을 사용할 수 없습니다",
    en: "google map doens't provide google map driving mode in this city"
  },
  noMoreThanTenTravelDays: {
    ko: "여행일자는 10일을 초과할 수 없습니다.",
    en: "travel day can not be more than ten days"
  },
  clickHereAndResizeAsYouWant: {
    ko: "마우스를 누른채로 드래그하여 넓이를 자유롭게 조절하세요.",
    en: "click here and resize as you want"
  },
  insertYourFeedback: {
    ko: "피드백을 입력해주세요",
    en: "insert your feedback"
  },
  failToPostFeedback: {
    ko: "피드백 전송 실패",
    en: "fail to post feedback"
  },
  searchPlacePlease: {
    ko: "장소를 검색하세요",
    en: "search place please"
  },
  searchHotelPlease: {
    ko: "호텔을 검색하세요",
    en: "search hotel please"
  },
  guideForRecommendedCourse: {
    ko: "아래 목록의 장소들을 클릭하여 개별 선택이 가능하고 우측 핀 버튼을 클릭하면 전체 선택됩니다.",
    en: "you can select each place or click the right pin to select all"
  },
  selectAll: {
    ko: "전체 선택",
    en: "select all"
  },
  moreRecommendedCourseComingSoon: {
    ko: "더욱 다양한 추천일정을 준비 중입니다.",
    en: "variable recommend course coming soon..."
  },
  selectDateAndChooseHotel: {
    ko: "일자 버튼을 누르고 호텔을 추가하세요.",
    en: "select the date and choose your hotel"
  },
  sendUsYourFeedback: {
    ko: "이 버튼을 눌러서 저희에게 피드백을 보내주세요!",
    en: "send us your feedback please"
  },
  doYouHaveSomeProblems: {
    ko: "사용이 불편하신가요?",
    en: "have problems?"
  },
  insertPlaceName: {
    ko: "장소명을 입력해주세요",
    en: "insert place name please"
  },
  registerThisPlace: {
    ko: "선택장소등록",
    en: "register this place"
  },
  watchInGoogleMap: {
    ko: "구글맵에서보기",
    en: "watch in google map"
  },
  placeRegisterComplete: {
    ko: "장소가 등록되었습니다. 이제 검색창에서 검색이 가능합니다",
    en: "the place has been registered. you can now search it"
  },
  placeRegisterError: {
    ko: "장소등록에 문제가 있습니다. 관리자에게 문의해주세요",
    en: "there is an error registering place. please contact to administrator"
  },
  whenClickSendPlan: {
    ko: "이메일 전송을 하지 않으면 만들어진 일정이 저장되지 않습니다. 이메일로 일정을 전송하면 여행지에서 편하게 사용하실 수 있는 모바일 전용 페이지를 보내드리며, 언제든 <b>수정이 가능</b>합니다.",
    en: "If you don't send the plan to your email, the plan will not be saved. You will get an awsome mobile page that you can use during you travel, and also always can modify your plan."
  },
  whenSelectedHotel: {
    ko: "일차 호텔을 선택하셨습니다.",
    en: "Day hotel selected"
  },
  thanksForHelpUs: {
    ko: "소중한 설문에 감사드립니다.",
    en: "we appreciate for your help"
  }
};