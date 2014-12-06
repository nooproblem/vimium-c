// Generated by CoffeeScript 1.8.0
(function() {
  var activatedElement, ensureScrollChange, getDimension, isRendered, root, scrollProperties;

  root = window.Scroller = {};

  activatedElement = null;

  root.init = function() {
    handlerStack.push({
      DOMActivate: function() {
        activatedElement = event.target;
        return true;
      }
    });
  };
  
  root.setSmoothScroll = function() {
  };

  scrollProperties = {
    x: {
      axisName: 'scrollLeft',
      max: 'scrollWidth',
      viewSize: 'clientHeight'
    },
    y: {
      axisName: 'scrollTop',
      max: 'scrollHeight',
      viewSize: 'clientWidth'
    }
  };

  getDimension = function(el, direction, name) {
    if (name === 'viewSize' && el === document.body) {
      if (direction === 'x') {
        return window.innerWidth;
      } else {
        return window.innerHeight;
      }
    } else {
      return el[scrollProperties[direction][name]];
    }
  };

  ensureScrollChange = function(direction, changeFn) {
    var axisName, element, lastElement, oldScrollValue, rect;
    axisName = scrollProperties[direction].axisName;
    element = activatedElement;
    while (true) {
      oldScrollValue = element[axisName];
      changeFn(element, axisName);
      if (!(element[axisName] === oldScrollValue && element !== document.body)) {
        break;
      }
      lastElement = element;
      element = element.parentElement || document.body;
    }
    rect = activatedElement.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight || rect.right < 0 || rect.left > window.innerWidth) {
      activatedElement = element;
    }
  };

  root.scrollBy = function(direction, amount, factor) {
    if (factor == null) {
      factor = 1;
    }
    if (!document.body && amount instanceof Number) {
      if (direction === "x") {
        window.scrollBy(amount, 0);
      } else {
        window.scrollBy(0, amount);
      }
      return;
    }
    if (!activatedElement || !isRendered(activatedElement)) {
      activatedElement = document.body;
    }
    ensureScrollChange(direction, function(element, axisName) {
      var elementAmount = Utils.isString(amount) ? getDimension(element, direction, amount) : amount;
      element[axisName] += elementAmount * factor;
    });
  };

  root.scrollTo = function(direction, pos) {
    if (!document.body) {
      return;
    }
    if (!activatedElement || !isRendered(activatedElement)) {
      activatedElement = document.body;
    }
    ensureScrollChange(direction, function(element, axisName) {
      element[axisName] = Utils.isString(pos) ? getDimension(element, direction, pos) : pos;
    });
  };

  isRendered = function(element) {
    var computedStyle;
    computedStyle = window.getComputedStyle(element, null);
    return !(computedStyle.getPropertyValue("visibility") !== "visible" || computedStyle.getPropertyValue("display") === "none");
  };

}).call(this);
