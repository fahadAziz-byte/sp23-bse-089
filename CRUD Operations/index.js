
let activities = [{
  "id" : 1,
  "activity": "Learn Express.js",
  "type": "education",
},
{
  "id" : 2,
  "activity": "Learn Computer Networking",
  "type": "education",
}];

function displayActivities() {
  renderActivities();
  $.ajax({
    url: "https://cors-anywhere.herokuapp.com/https://www.boredapi.com/api/activity",
    method: "GET",
    dataType: "json",
    success: function (data) {
      renderActivities();
    },
    error: function (error) {
      console.error("Error fetching activities:", error);
    },
  });
}

function renderActivities() {
  var activitiesList = $("#activitiesList");
  activitiesList.empty();

  $.each(activities, function (index, activity) {
    activitiesList.append(
      `<div class="mb-3">
            <h3>${activity.activity}</h3>
            <div>${activity.type}</div>
            <div>
                <button class="btn btn-info btn-sm mr-2 btn-edit" data-id="${activity.id}">Edit</button>
                <button class="btn btn-danger btn-sm mr-2 btn-del" data-id="${activity.id}">Delete</button>
            </div>
        </div>
        <hr />`
    );
  });
}
function deleteActivity() {
  let activityId = $(this).attr("data-id");
  activities = activities.filter(activity => activity.id != activityId);
  renderActivities();
}
function handleFormSubmission(event) {
  event.preventDefault();
  let activityId = $("#createBtn").attr("data-id");
  var activityTitle = $("#createTitle").val();
  var activityType = $("#createContent").val();

  if (activityId) {
    activities = activities.map(activity =>
      activity.id == activityId ? { ...activity, activity: activityTitle, type: activityType } : activity
    );
  } else {
    const newActivity = {
      id: Date.now(),
      activity: activityTitle,
      type: activityType
    };
    activities.push(newActivity);
  }

  $("#clearBtn").hide();
  $("#createBtn").removeAttr("data-id").html("Create");
  $("#createTitle").val("");
  $("#createContent").val("");
  renderActivities();
}


function editBtnClicked(event) {
  event.preventDefault();
  let activityId = $(this).attr("data-id");
  const activity = activities.find(activity => activity.id == activityId);
  
  if (activity) {
    $("#clearBtn").show();
    $("#createTitle").val(activity.activity);
    $("#createContent").val(activity.type);
    $("#createBtn").html("Update").attr("data-id", activity.id);
  }
}

$(document).ready(function () {
  displayActivities();
  $(document).on("click", ".btn-del", deleteActivity);
  $(document).on("click", ".btn-edit", editBtnClicked);


  $("#createForm").submit(handleFormSubmission);


  $("#clearBtn").on("click", function (e) {
    e.preventDefault();
    $("#clearBtn").hide();
    $("#createBtn").removeAttr("data-id").html("Create");
    $("#createTitle").val("");
    $("#createContent").val("");
  });
});
