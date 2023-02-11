(function () {
    let acceptRequestBtn = $("#accept-request");
    let rejectRequestBtn = $("#reject-request");
    let userParentCont = $('.user-request-cont');

    acceptRequestBtn.click(e => updateRequestStatus(e.target, "accept"));
    rejectRequestBtn.click(e => updateRequestStatus(e.target, "reject"));

    function updateRequestStatus(btn, status) {

        let from_user = $(btn).attr('from_user');
        let to_user = $(btn).attr('to_user');

        $.ajax({
            method: "PATCH",
            url: "/users/update-friend-status",
            data: { from_user, to_user, status },
            success: function (data) {
                let toggleBtn;
                if (data.message == "requested rejected") {
                    toggleBtn = $(`<button class="btn btn-primary ms-3" toggle-value="add" id="toggle-friend-btn" from_user="${from_user}" to_user="${to_user}">Add Friend</button>`);
                } else if (data.message == "requested accepted") {
                    // console.log(`${data.data.friend} is now a friend`);
                    toggleBtn = $(`<button class="btn btn-primary ms-3" toggle-value="remove" id="toggle-friend-btn" from_user="${from_user}" to_user="${to_user}">Remove Friend</button>`);
                }
                userParentCont.empty();
                userParentCont.append(toggleBtn);
                attachToggleEvent(toggleBtn);
                console.log(data.data);
            },
            error: function (error) {
                console.log(error.responseText);
            }
        });
    }

    function attachToggleEvent(toggleFriendBtn) {

        let from_user = toggleFriendBtn.attr('from_user');
        let to_user = toggleFriendBtn.attr('to_user');
        let toggleValue = toggleFriendBtn.attr('toggle-value').trim();

        console.log(from_user);
        console.log(to_user);
        console.log(toggleValue);

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
    }


})();