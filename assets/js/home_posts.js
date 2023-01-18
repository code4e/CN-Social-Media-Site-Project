(function () {

    let postsList = $("#posts-list-cont>ul");


    postsList.click(function (event) {

        //check if the target elemnent clicked is the delete post button
        if (event.target.className == "delete-post-button") {
            event.preventDefault();
            let deletePostBtn = $(event.target);
            let deleteLink = deletePostBtn.attr('href');
            //delete the post whose delete button is clicked on the basis of the delete link
            deletePost(deleteLink);

        }
        ;
    });
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
                    },
                error: function (error) {
                    console.log(error.responseText);
                },
                // dataType: dataType
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

        // console.log(post);


        // let deleteLink = $(' .delete-post-button', newPostItem);
        // deleteLink.click(deletePost);
        postsList.prepend(newPostItem);

    }

    let deletePost = function (deleteLink) {
        if (!deleteLink) return;
        $.ajax({
            url: deleteLink,
            type: 'DELETE',
            success: function (data) {
                //    console.log(data);
                $(`#post-${data.data.post_id}`).remove();
                // console.log($(`#post-${data.data.post_id}`));
            },
            error: function (error) {
                // console.log(error.responseText);
                console.log('unable to delete');
            }
        });
    }


    createPost();


})();