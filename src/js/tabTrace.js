(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return factory(root);
    });
  } else if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = factory(root);
  } else {
    root.tabTrace = factory(root);
  }
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function (window) {
  var tabTrace = function (selector, mode, option_) {
    if (selector.charCodeAt(0) !== 0x2E) {
      throw new TypeError('The 1st parameter must be class name')
    }
    if (mode !== 'vertical' && mode !== 'horizontal') {
      throw new TypeError('The 2nd parameter must be vertical or horizontal')
    }
    var itemList = document.querySelectorAll(selector)
    var len = itemList.length
    var line = document.createElement('div')
    var firstItem = itemList[0]
    var parent = firstItem.parentNode
    var option = {
      height: '3px',
      width: '3px',
      bgColor: 'red',
      activeItemColor: '#1ABAC8',
      transitionTimeFun: 'ease-in-out',
      transitionDuration: '.35s',
      eventType: 'click',
      borderRadius: '6px',
      activeIndex: 0,
      onClick: null,
      onMouseenter: null,
      onMouseleave: null,
      boxShadow: ''
    }

    var extend = function (target, source) {
      source = source || {}
      for (var key in source) {
        target[key] = source[key]
      }
      return target
    }

    //mrege option
    option = extend(option, option_)
    var activeIndex = option.activeIndex

    var setStyle = function (target, styles) {
      for (var style in styles) {
        target.style[style] = styles[style]
      }
      return target;
    }

    var getLeft = function (target) {
      return target.getBoundingClientRect().left
    }

    var getTop = function (target) {
      return target.getBoundingClientRect().top
    }

    var getComputedWidth = function (target) {
      return parseFloat(window.getComputedStyle(target).width)
    }

    var getComputedHeight = function (target) {
      return parseFloat(window.getComputedStyle(target).height)
    }


    var getWidthRelativePercentage = function (item) {
      return getComputedWidth(item) /
        getComputedWidth(parent) * 100 + '%'
    }

    var getHeightRelativePercentage = function (item) {
      return getComputedHeight(item) /
        getComputedHeight(parent) * 100 + '%'
    }

    var getMoveRelativePercentage = function (RelativeDistance, firstItemEdge) {
      var parentEdge = mode == 'horizontal' ?
        getLeft(parent) : getTop(parent)

      var parentWrap = mode == 'horizontal' ?
        getComputedWidth(parent) : getComputedHeight(parent)

      //兼容x,y轴方向，父级元素的内部边距，item的外部边距
      var OffsetEdge = (firstItemEdge - parentEdge) || 0
      return (RelativeDistance + OffsetEdge) / parentWrap * 100 + '%'
    }

    var move = function (endEL, startEL, line) {
      var end = mode == 'horizontal' ?
        getLeft(endEL) : getTop(endEL)

      var start = mode == 'horizontal' ?
        getLeft(startEL) : getTop(startEL)

      var distance = end - start

      setStyle(line, {
        width: mode == 'horizontal' ?
          getWidthRelativePercentage(endEL) : option.width,
        left: mode == 'horizontal' ?
          getMoveRelativePercentage(distance, start) : 0,
        height: mode == 'vertical' ?
          getHeightRelativePercentage(endEL) : option.height,
        top: mode == 'vertical' ?
          getMoveRelativePercentage(distance, start) : ''
      })
    }


    var initTrace = function (targetLine, targetItem) {
      parent.appendChild(targetLine)
      setStyle(targetLine, {
        position: 'absolute',
        backgroundColor: option.bgColor,
        transition: 'all ' + option.transitionTimeFun + ' ' +
          option.transitionDuration,
        borderRadius: option.borderRadius,
        boxShadow: option.boxShadow,
        bottom: mode == 'horizontal' ? '0' : ''
      })
      setStyle(targetItem, {
        color: option.activeItemColor
      })
      move(targetItem, firstItem, targetLine)
    }



    var resetColor = function () {
      for (var i = 0; i < itemList.length; i++) {
        setStyle(itemList[i], {
          color: ''
        })
      }
    }


    var checkCurrIndex = function (target) {
      var index_ = itemList.length
      while (index_--)
        if (itemList[index_] === target) return index_
    }


    var handleTrace = function (e) {
      var target = e.target
      var currentIndex = checkCurrIndex(target)
      move(target, firstItem, line)
      typeof option.onMouseenter === 'function' &&
        option.onMouseenter(e, currentIndex)

    }


    var handleLeave = function (e) {
      var target = e.target
      var currentIndex = checkCurrIndex(target)
      move(itemList[activeIndex], firstItem, line)
      typeof option.onMouseleave === 'function' &&
        option.onMouseleave(e, currentIndex)
    }

    var isMouseEvent = option.eventType == 'click' ? false : true

    var handleClick = function (e) {
      var target = e.target
      var currentIndex = checkCurrIndex(target)
      resetColor()
      setStyle(target, {
        color: option.activeItemColor
      }) 
      !isMouseEvent && move(target, firstItem, line) || (activeIndex = currentIndex)
      typeof option.onClick === 'function' &&
        option.onClick(e, currentIndex)
    }

    initTrace(line, itemList[activeIndex])

    while (len--) {
      if (!isMouseEvent) {
        itemList[len].addEventListener('click', handleClick)
      } else if (isMouseEvent) {
        itemList[len].addEventListener('mouseenter', handleTrace)
        itemList[len].addEventListener('mouseleave', handleLeave)
        itemList[len].addEventListener('click', handleClick)
      }
    }
  }


  return tabTrace;
})