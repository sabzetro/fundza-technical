
class FundzaPostSelector extends HTMLElement {
    constructor() {
      super();
      //Construct all HTML Elements that will make up the page.
      const rootEl = document.createElement('h1');

      const titleBlock = document.createElement('h2');
      titleBlock.id = 'title';

      const postIdListener = document.createElement('h3');
      postIdListener.id = "post-listener"
      /**
       * This listener waits for the Post ID to change and triggers rendering of the new data
       */
      this.addEventListener('post-id-changed', (event) => {
        postIdListener.innerText = `The currest post ID is: ${event.detail.id}`;
        this.getPost(event.detail.id);
      })

      const bodyBlock = document.createElement('div');
      bodyBlock.id = 'body';

      const postIdInput = document.createElement('input');
      postIdInput.id = 'post-input'
      

      rootEl.textContent = 'Fundza Post Finder';
      rootEl.id = "heading";
      
      //Add all elements to the DOM
      document.body.append(rootEl);
      document.body.append(titleBlock);
      document.body.append(postIdListener);
      document.body.append(bodyBlock);
      
      //Create search div and elements

      const button = document.createElement('button');
      button.innerText = "Search for Post";
      button.id = 'button';

      const searchDiv = document.createElement('div');
      searchDiv.id = 'search'
      searchDiv.append(postIdInput);
      searchDiv.append(button);

      document.body.append(searchDiv);

      //This button is used when the Post ID is entered into the input, to serve the post;
      button.addEventListener("click", (event)=>{
          var postId = document.querySelector('#post-input').value;
          this.setAttribute('post-id', postId);
          this.getPost(postId);
      });


      //After first load, attach a MutationObserver to perform callbacks when input attributes change
      window.onload = () => {
          const config = { attributes: true, childList: true, subtree: true };

          const observer = new MutationObserver((mutationsList, observer) => {
              for(let mutation of mutationsList) {
                  if (mutation.type === 'attributes') {
                      //Get the post ID as it will have changed.
                      var postId = this.getAttribute('post-id');

                      /**
                       * Custom event for Post ID change is registered, and emitted to the current context 
                       * (in this case, the whole Fundza Post Select Component);
                       */
                       
                      var event = new CustomEvent('post-id-changed', {detail: {id: postId}});
                      this.dispatchEvent(event);
                  }
              }
          })
          
          //Begin observing the whole custom component for changes
          observer.observe(this, config);
      }

    }



    /**
     * 
     * @param {*} title The title of the post to be displayed
     * @param {*} body The actual HTML content to be rendered for the post
     */
    setPostDisplay(title, body){
      var titleBlock = document.querySelector('#title');
      var bodyBlock = document.querySelector('#body');

      console.log(titleBlock);
      console.log(bodyBlock);

      titleBlock.innerText = title;
      bodyBlock.innerHTML = body;

    }

    /**
     * 
     * @param {*} id The ID of the post to be retrieved from the WP JSON Endpoint
     * 
     * The response content is then used to parse and populate the display.
     */
    getPost(id) {
      //Open a new Request Client, to call API
      var client = new XMLHttpRequest();
      client.open('GET', "https://live.fundza.mobi/wp-json/wp/v2/posts/" + id);
      client.send();

      //Once a response has been received, either return the post data or throw error

      var response = client.onload = () => {
        if (client.status != 200) {
          this.setPostDisplay("ERROR", "We can't seem to find your post. Please try another ID.");
        } else {
          var json = JSON.parse(client.response);
          this.setPostDisplay(json.title.rendered, json.content.rendered);
        }
      }
      
    }
  }
  window.customElements.define('fundza-post-select', FundzaPostSelector);

  module.exports = {
    FundzaPostSelector: FundzaPostSelector
}