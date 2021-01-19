var msgId = 0;
var boxId = 100;

function addComment(id, data, noMargin) {
  var block = document.createElement("div");
  block.setAttribute("id", data.id);
  var content = createContent(data.comment);
  var boxAndButton = createTextWithButton(data.id);
  if (!noMargin) block.style.marginLeft = "20px";
  block.appendChild(content);
  block.appendChild(boxAndButton);
  document.getElementById(id).appendChild(block);
}

function pushComment(id, data) {
  var found = false;
  var findPlaceToAdd = function (id, data, parentArray) {
    parentArray.some(function (item) {
      if (item.id == id) {
        found = true;
        item.children.push(data);
        // updateDom
        addComment(id, data);
      }
    });
    if (!found) {
      parentArray.forEach(function (item) {
        findPlaceToAdd(id, data, item.children);
      });
    }
  };

  findPlaceToAdd(id, data, allComments);
}

function addLikeCount(id) {
  var block = document.createElement("span");
  block.setAttribute("id", id + "_like");
  block.innerHTML = 1;
  block.style.display = "flex";
  document.getElementById(id).appendChild(block);
}

function updateLikeCount(id) {
  var like = document.getElementById(id + "_like");
  ++like.innerText;
}

function incrementLike(id) {
  var found = false;
  var findPlaceToAdd = function (id, parentArray) {
    parentArray.some(function (item) {
      if (item.id == id) {
        found = true;
        item.like++;
        if (item.like == 1) addLikeCount(id);
        else updateLikeCount(id);
      }
    });
    if (!found) {
      parentArray.forEach(function (item) {
        findPlaceToAdd(id, item.children);
      });
    }
  };

  findPlaceToAdd(id, allComments);
}

function createContent(content) {
  var commentContent = document.createElement("div");
  commentContent.innerHTML = content;
  return commentContent;
}

function createTextWithButton(parentId) {
  boxId++;
  var id = boxId;
  var commentDiv = document.createElement("div");
  var textbox = document.createElement("textarea");
  textbox.setAttribute("id", id);
  textbox.style.backgroundColor = "#e5e5e5";
  textbox.style.maxHeight = "30px";
  textbox.style.minHeight = "30px";
  textbox.style.minWidth = "450px";
  textbox.style.maxWidth = "450px";
  textbox.style["font-family"] = "Arial";

  textbox.style.alignSelf = "center";

  var buttonDiv = document.createElement("div");
  var button = document.createElement("button");
  button.innerHTML = "Comment";
  button.style.backgroundColor = "#2a60f3";
  button.style.color = "white";
  button.onclick = function () {
    var comment = document.getElementById(id).value;
    document.getElementById(id).value = "";
    if (comment !== "")
      pushComment(parentId, {
        id: ++msgId,
        comment: comment,
        children: [],
        like: 0
      });
  };
  var like = likeButton();
  like.style.float = "left";
  like.style.marginRight = "20px";
  like.onclick = function () {
    incrementLike(parentId);
  };
  buttonDiv.appendChild(like);
  buttonDiv.appendChild(button);
  commentDiv.appendChild(textbox);
  commentDiv.appendChild(buttonDiv);

  return commentDiv;
}

function likeButton() {
  var button = document.createElement("button");
  button.innerHTML = "like";
  return button;
}

function renderComments(domId, comments) {
  comments.forEach(function (item) {
    var block = document.createElement("div");
    block.setAttribute("id", item.id);
    var content = createContent(item.comment);
    var boxAndButton = createTextWithButton(item.id);
    block.appendChild(content);
    block.appendChild(boxAndButton);
    document.getElementById(domId).appendChild(block);
    if (item.children) {
      renderComments(item.id, item.children);
    }
  });
}

function createCommentLayoutWithData(domId, comments) {
  comments.forEach(function (item) {
    addComment(domId, item, true);
    if (item.children) {
      renderComments(item.id, item.children);
    }
  });
}
//fetch content pass in as 2nd arg
createCommentLayoutWithData("container", allComments);
