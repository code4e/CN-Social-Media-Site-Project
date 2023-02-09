(function () {
    let postsList = $("#posts-list-cont>ul");

    //posts
    postsList.click(function (event) {
        //check if the target elemnent clicked is the delete post button
        if (event.target.classList.contains("delete-post-button")) {
            event.preventDefault();
            let deletePostBtn = $(event.target);
            let deleteLink = deletePostBtn.attr('href');

            //delete the post whose delete button is clicked on the basis of the delete link
            deletePost(deleteLink);
        } else if (event.target.className == "delete-comment-button") {
            event.preventDefault();
            deleteCommentLink = $(event.target).attr('href');
            deleteComment(deleteCommentLink);
        } else if (event.target.classList.contains("like-btn")) {
            likeItem(event.target);
        }
    });

    function likeItem(likeBtn) {
        $(likeBtn).toggleClass('fa-solid').toggleClass('fa-regular');

        $.ajax({
            type: "POST",
            url: `/likes/toggle?id=${likeBtn.id.split("-")[2]}&likeType=${likeBtn.id.includes("post") ? "Post" : "Comment"}`,
            success: function (data) {
                //toggle like on DOM
                let currentLikeCount = parseInt(likeBtn.nextElementSibling.textContent);
                data.data.alreadyLiked ? ++currentLikeCount : --currentLikeCount;
                likeBtn.nextElementSibling.textContent = currentLikeCount;
            },
            error: function (error) {
                console.log('failed to toggle like');
            }
        });
    }
    //submit new post form data through ajax
    let createPost = function () {
        let newPostForm = $("#new-post-form");

        newPostForm.submit(event => {
            event.preventDefault();

            //make ajax request for form submission
            $.ajax({
                type: "POST",
                url: "/posts/create",
                data: newPostForm.serialize(),// serializes the form data i.e. converts the form data into json
                success:
                    function (data) {
                        //if the post was created successfully, then append it to the DOM
                        appendCreatedPostToDOM(data.data.post);
                        //show noty for sucessfull post creation
                        $.getScript("/js/notifications.js", function () {
                            showSucessNotification(data.message);
                        });
                    },
                error: function (error) {
                    console.log(error.responseText);
                    $.getScript("/js/notifications.js", function () {
                        showErrorNotification('Oops! unable to create post');
                    });
                },
            });

        })
    }

    //create a post in the DOM to show in the UI
    let appendCreatedPostToDOM = function (post) {
        let newPostItem = $(`
        <li id="post-${post._id}" class="list-group-item bg-success p-2 m-1 overflow-auto">
        <div class="">
        <div class="card mb-1">
          <h5 class="card-header">Featured</h5>
          <div class="card-body">
            <!-- <h5 class="card-title">Special title treatment</h5> -->
            <div class="card-text d-flex justify-content-between align-items-end">
              <p class="m-1">
              ${post.content}
              </p>
              <small>
              <span>--${post.user.name}</span>
              </small>
            </div>    
            <!-- only show the delete button to the user who is signed and only to whom has made that post -->
            <a class="btn btn-primary delete-post-button m-1" href="/posts/destroy/${post._id}">Delete post</a>
          </div>
        </div>
      </div>
        <div class="post-comments-list mb-1">
            <div class="accordion" id="accordion-${post._id}">
              <div class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    Comments for this post
                  </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordion-${post._id}">
                  <div class="accordion-body">
                    <ul id="post-comments-${post._id}" class="list-group">
                      </ul>             
                  </div>
                </div>
              </div>
            </div>
            <div class="post-comments">
                <h3>Add a comment</h3>
                <form action="/comments/create" method="post">
                    <input type="text" name="content" required placeholder="Type here to add comment...">
                    <input type="hidden" name="post" value=${post._id}>
                    <button type="submit">Add comment</button>
                </form>
            </div>
            <hr>
            <div class="likes-container">
            <i class="fa-regular fa-thumbs-up like-btn" id="like-post-${post._id}"></i>
            <span>${post.likes.length}</span>
          </div>
        </li>`);

        postsList.prepend(newPostItem);

        //attach comment form event when a new post is created
        let newCommentForm = $("form", newPostItem);

        //when a new post is created, dynamically attach the comment form event to the post
        addCommentFormSubmissionEvent(newCommentForm);
    }

    let deletePost = function (deleteLink) {
        if (!deleteLink) return;
        $.ajax({
            url: deleteLink,
            type: 'DELETE',
            success: function (data) {
                $(`#post-${data.data.post_id}`).remove();
                //show noty for sucessful post deletion
                $.getScript("/js/notifications.js", function () {
                    showSucessNotification(data.message);
                });
            },
            error: function (error) {
                console.log('unable to delete');

                //show error noty in case of failure in deletion
                $.getScript("/js/notifications.js", function () {
                    showErrorNotification('Oops! unable to delete post');
                });

            }
        });
    }

    createPost();


    //comments
    function addCommentFormSubmissionEvent(postCommentsForm) {

        console.log("event attached");
        postCommentsForm.submit(event => {
            event.preventDefault();
            //make ajax request for form submission for comment creation
            $.ajax({
                type: "POST",
                url: "/comments/create",
                data: postCommentsForm.serialize(),// serializes the form data i.e. converts the form data into json
                success:
                    function (data) {
                        //if the post was created successfully, then append it to the DOM
                        appendCreatedCommentToDOM(data.data.comment);
                        //show noty for sucessfull comment creation
                        $.getScript("/js/notifications.js", function () {
                            showSucessNotification(data.message);
                        });
                    },
                error: function (error) {
                    console.log(error.responseText);
                    //show error noty in case of failure
                    $.getScript("/js/notifications.js", function () {
                        showErrorNotification('Oops! unable to create comment');
                    });

                },
            });
        });
    }

    for (const postItem of postsList.children()) {
        let postCommentsForm = $(".post-comments form", $(postItem));
        addCommentFormSubmissionEvent(postCommentsForm);
    }


    let appendCreatedCommentToDOM = function (comment) {
        let newComment = $(`<li id=comment-${comment._id} class="list-group-item bg-success">
            <p>
            ${comment.content}
                &nbsp;
                <!-- show the delete comment button only to the user who made the comment and signed in -->
                    <a class="delete-comment-button" href="/comments/destroy?commentID=${comment._id}&postUserID=${comment.post._id}">Delete comment</a>
            </p>
            <small>
                : - Made by - ${comment.user.name}
            </small>
            <hr>
            <div class="likes-container">
              <i class="fa-regular fa-thumbs-up like-btn" id="like-comment-${comment._id}"></i>
              <span>${comment.likes.length}</span>
            </div>
        </li>`);

        let postCommentsList = $(`#post-comments-${comment.post._id}`);
        postCommentsList.prepend(newComment);
    }

    let deleteComment = function (deleteLink) {
        if (!deleteLink) return;
        $.ajax({
            url: deleteLink,
            type: 'DELETE',
            success: function (data) {
                $(`#comment-${data.data.commentId}`).remove();
                // //show noty for sucessful commment deletion
                $.getScript("/js/notifications.js", function () {
                    showSucessNotification(data.message);
                });
            },
            error: function (error) {
                console.log('unable to delete');
                //show error noty in case of failure in deletion
                $.getScript("/js/notifications.js", function () {
                    showErrorNotification('Oops! unable to delete comment');
                });

            }
        });
    }

})();