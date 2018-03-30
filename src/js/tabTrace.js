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
  var tabTrace = function (selector, option_) {
    if (selector.charCodeAt(0) !== 0x2E) {
      throw new Error('The 1st parameter must be class name')
    }
    var itemList = document.querySelectorAll(selector)
    var len = itemList.length
    var line = document.createElement('div')
    var firstItem = itemList[0]
    var parent = firstItem.parentNode
    var option = {
      height: '3px',
      bgColor: 'red',
      transitionTimeFun: 'ease-in-out',
      transitionDuration: '.3s',
      eventType: 'click',
      borderRadius: '30%',
      activeIndex: 0
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

    var getRight = function (target) {
      return target.getBoundingClientRect().right
    }

    var getWidthRelativePercentage = function (item) {
      var parentWidth = window.getComputedStyle(parent).width
      var itemWidth = window.getComputedStyle(item).width
      var percentage = (parseFloat(itemWidth) / parseFloat(parentWidth)) * 100 + '%'
      return percentage
    }

    var getLeftRelativePercentage = function (RelativeDistance) {
      var firstItemLeft = getLeft(firstItem)
      var parentLeft = getLeft(parent)
      var parentWidth = parseFloat(window.getComputedStyle(parent).width)

      //兼容x轴方向，父级元素的内部边距，item的外部边距
      var OffsetX = (firstItemLeft - parentLeft) || 0
      return (RelativeDistance + OffsetX)/ parentWidth * 100 + '%'
    }

  
    var move = function (endEL, startEL, line) {
      var end = getLeft(endEL)
      var start = getLeft(startEL)
      var distance = end - start
      setStyle(line, {
        width: getWidthRelativePercentage(endEL),
        left: getLeftRelativePercentage(distance)
      })
    }


    var initTrace = function (targetLine, targetItem) {
      parent.appendChild(targetLine)
      setStyle(targetLine, {
        position: 'absolute',
        height: option.height,
        backgroundColor: option.bgColor,
        transition: 'all ' + option.transitionTimeFun + ' ' + option.transitionDuration,
        borderRadius: option.borderRadius,
        bottom: '0'
      })
      setStyle(targetItem, {
        color: 'purple'
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


    var handleTrace = function (e) {
      var target = e.target
      move(target, firstItem, line)
    }


    var handleLeave = function (e) {
      var target = e.target
      move(itemList[activeIndex], firstItem, line)
    }


    var handleClick = function (e) {
      var target = e.target
      resetColor()
      setStyle(target, {
        color: 'purple'
      })
      move(target, firstItem, line)
    }

    initTrace(line, itemList[activeIndex])


    while (len--) {
      if (option.eventType == 'click') {
        itemList[len].addEventListener('click', handleClick)
      } else if (option.eventType == 'mouseenter') {
        itemList[len].addEventListener('mouseenter', handleTrace)
        itemList[len].addEventListener('mouseleave', handleLeave)
      }
    }
  }
  return tabTrace;
})