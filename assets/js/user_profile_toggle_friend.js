(function () {
    let toggleFriendBtn = $("#toggle-friend-btn");

    let from_user = toggleFriendBtn.attr('from_user');
    let to_user = toggleFriendBtn.attr('to_user');
    let toggleValue = toggleFriendBtn.attr('toggle-value').trim();

    toggleFriendBtn.click(event => {
        $.ajax({
            method: "PATCH",
            url: "/users/toggle-friend",
            data: { from_user, to_user, toggleValue },
            success: function (data) {
                //toggle the friend btn status as per the fact - friend is being added or removed
                if (toggleValue == "add") {
                    toggleValue = "remove";
                    toggleFriendBtn.attr("toggle-value", "remove");
                    toggleFriendBtn.text("Remove Friend");
                    //show notification that the request has been sent
                    $.getScript("/js/notifications.js", function () {
                        showSucessNotification('Friend request has been sent sucessfully');
                    });

                } else if (toggleValue == "remove") {
                    toggleValue = "add";
                    toggleFriendBtn.attr("toggle-value", "add");
                    toggleFriendBtn.text("Add Friend");

                    //show notification that the friend request has been removed
                    $.getScript("/js/notifications.js", function () {
                        showSucessNotification('Friend request has been removed sucessfully');
                    });
                }
            },
            error: function (error) {
                console.log(error.responseText);
                $.getScript("/js/notifications.js", function () {
                    showErrorNotification('Oops! failed to add friend');
                });
            }
        });
    });
})();