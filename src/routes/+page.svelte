<script>
  import Copy from "$lib/Copy.svelte";
  import { GET } from "./api/get/+server";
  import { POST } from "./api/post/+server";

  let responseStatusCode = "";
  let responseStatusText = "";
  // to be done
  // let timeTaken = "";
  // let responseSize = "";
  let responseText = "";
  let url, fetchMode;

  function displayResponse(response) {
    console.log(response);
    responseStatusCode = response.status;
    responseStatusText = response.statusText;
    // size and time to be done
    responseText = JSON.stringify(response.data, null, 4);
  }
  function displayError(error) {
    responseStatusCode = " ";
    responseStatusText = " ";
    responseText = error.toString();
  }
  function stringFormatter(str) {
    str = str.replace(/\n/g, " "); //removing new lines
    str = str.replace(/\r/g, ""); //removing carriage return character
    str = str.replace(/\s+/g, " ").trim(); //removing excess spaces
    str = str.replace(/'/g, '"'); //replacing ' with "
    return str;
  }

  async function getData(event) {
    if (fetchMode == "GET") {
      await GET(url, {}, {})
        .then((response) => {
          displayResponse(response);
        })
        .catch((error) => {
          displayError(error);
        });
    } else if (fetchMode == "POST") {
      let jsonBodyStr = stringFormatter(
        document.getElementById("post-json-body").value
      );
      console.log(jsonBodyStr);
      let jsonBody;
      try {
        jsonBody = JSON.parse(jsonBodyStr);
        console.log(jsonBody);
      } catch (error) {
        console.log(error);
        displayError("Invalid JSON Input");
        return;
      }
      await POST(url, jsonBody, {
        "Content-type": "application/json; charset=UTF-8",
      })
        .then((response) => {
          displayResponse(response);
        })
        .catch((error) => {
          displayError(error);
        });
    }
  }
</script>

<head>
  <link
    rel="stylesheet"
    href="../node_modules/bootstrap/dist/css/bootstrap.min.css"
  />
</head>

<div class="p-4">
  <h1>Online API Tool</h1>
  <form>
    <div class="input-group mx-2 my-2">
      <select
        id="fetch-mode"
        class="form-select flex-grow-0 w-auto"
        bind:value={fetchMode}
      >
        <option value="GET" selected>GET</option>
        <option value="POST">POST</option>
      </select>
      <input
        required
        bind:value={url}
        class="form-control w-auto"
        type="url"
        placeholder="Enter the URL"
      />
      <button
        id="send-data-btn"
        type="submit"
        class="btn btn-primary"
        on:click={getData}
      >
        Send
      </button>
    </div>
    {#if fetchMode == "POST"}
      <div class="mt-4 mx-2 d-flex flex-row">
        <label for="post-json-body" class="col-xs-2">Enter the JSON body</label>
        <textarea
          required
          id="post-json-body"
          class="form-control mx-4"
          type="text"
          placeholder="JSON Body"
          rows="6"
        />
        <!--
          {
             'title': 'foo',
             'body': 'bar',
             'userId': 1,
           }, -->
      </div>
    {/if}
  </form>

  <div class="mt-4" id="data-response-section">
    <h3>Response</h3>
    <div class="d-flex my-2" id="statusParams">
      <div class="me-3">
        Status Code: {responseStatusCode}
      </div>
      <div class="me-3">
        Status Text: {responseStatusText}
      </div>
      <!-- To be done -->
      <!-- <div class="me-3">
        Time: {timeTaken}
      </div>
      <div class="me-3">
        Data Size: {responseSize}
      </div> -->
    </div>
    <div
      class="d-flex my-2 p-2 text-wrap border flex-row-reverse justify-content-between"
      id="response-display"
    >
      <div class="align-self-baseline border">
        <Copy text={responseText.replace(/<\/?p>/g, "\n")} />
      </div>
      <pre id="responseText">{responseText}</pre>
    </div>
  </div>
</div>
