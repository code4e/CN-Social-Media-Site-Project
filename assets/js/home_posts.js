(function () {
    let postsList = $("#posts-list-cont>ul");

    //posts
    postsList.click(function (event) {

        //check if the target elemnent clicked is the delete post button
        if (event.target.className == "delete-post-button") {
            event.preventDefault();
            let deletePostBtn = $(event.target);
            let deleteLink = deletePostBtn.attr('href');
            //delete the post whose delete button is clicked on the basis of the delete link
            deletePost(deleteLink);

        } else if (event.target.className == "delete-comment-button") {
            event.preventDefault();
            deleteCommentLink = $(event.target).attr('href');
            deleteComment(deleteCommentLink);
        }
    });
    //submit new post form data through ajax
    let createPost = function () {
        let newPostForm = $("#new-post-form");
        // console.log(newPostForm);

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
        <li id="post-${post._id}">
            <p>
                ${post.content}
                    &nbsp;
                <a  class="delete-post-button" href="/posts/destroy/${post._id} ">Delete post</a>
            </p>
        
            <small>
                <span>--- ${post.user.name}</span>
            </small>

            <div class="post-comments-list">
                <h3>Comments for this post</h3>
        
                <ul id="post-comments-${post._id}">
        
                </ul>
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
        </li>`);

        postsList.prepend(newPostItem);

        //attach comment form event when a new post is created
        $.getScript("/js/home_post_comments.js", function () {
            let newCommentForm = $("form", newPostItem);
            // console.log(newCommentForm);

            //when a new post is created, dynamically attach the comment form event to the post
            addCommentFormSubmissionEvent(newCommentForm);
        });

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
        let newComment = $(`
        <li id=comment-${comment._id}>
            <p>
                ${comment.content}
                    &nbsp;
                    <!-- show the delete comment button only to the user who made the comment and signed in -->
                    <a class="delete-comment-button" href="/comments/destroy?commentID=${comment._id}&postUserID=${comment.post._id}">Delete comment</a>
            </p>
            <small>
                : - Made by - ${comment.user.name}
            </small>
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