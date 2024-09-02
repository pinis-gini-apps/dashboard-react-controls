"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useChipCell = void 0;
var _react = require("react");
var _lodash = require("lodash");
var _common = require("../utils/common.util");
var _getFirstScrollableParent = require("../utils/getFirstScrollableParent.util");
/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/

const useChipCell = (isEditMode, visibleChipsMaxLength) => {
  const [showHiddenChips, setShowHiddenChips] = (0, _react.useState)(false);
  const [chipsSizes, setChipsSizes] = (0, _react.useState)({});
  const [showChips, setShowChips] = (0, _react.useState)(false);
  const [visibleChipsCount, setVisibleChipsCount] = (0, _react.useState)(8);
  const transitionEndEventName = (0, _react.useMemo)(() => (0, _common.getTransitionEndEventName)(), []);
  const chipsCellRef = (0, _react.useRef)();
  const chipsWrapperRef = (0, _react.useRef)();
  const hiddenChipsCounterRef = (0, _react.useRef)();
  const hiddenChipsPopUpRef = (0, _react.useRef)();
  const handleShowElements = (0, _react.useCallback)(event => {
    if (!isEditMode || isEditMode && visibleChipsMaxLength) {
      var _hiddenChipsCounterRe;
      if (!((_hiddenChipsCounterRe = hiddenChipsCounterRef.current) !== null && _hiddenChipsCounterRe !== void 0 && _hiddenChipsCounterRe.contains(event.target))) {
        setShowHiddenChips(false);
      } else {
        setShowHiddenChips(true);
      }
    }
    event && event.stopPropagation();
  }, [isEditMode, visibleChipsMaxLength]);
  (0, _react.useEffect)(() => {
    if (showHiddenChips) {
      window.addEventListener('click', handleShowElements);
      return () => window.removeEventListener('click', handleShowElements);
    }
  }, [showHiddenChips, handleShowElements]);
  const handleScroll = (0, _react.useCallback)(event => {
    if (event.target.parentElement !== (hiddenChipsPopUpRef === null || hiddenChipsPopUpRef === void 0 ? void 0 : hiddenChipsPopUpRef.current)) {
      setShowHiddenChips(false);
    }
  }, [hiddenChipsPopUpRef]);
  (0, _react.useEffect)(() => {
    if (showHiddenChips) {
      window.addEventListener('scroll', handleScroll, true);
    }
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [handleScroll, showHiddenChips]);
  const resizeChipCell = (0, _react.useCallback)(() => {
    if (hiddenChipsPopUpRef !== null && hiddenChipsPopUpRef !== void 0 && hiddenChipsPopUpRef.current) {
      var _hiddenChipsCounterRe2;
      const scrollableParent = (0, _getFirstScrollableParent.getFirstScrollableParent)(hiddenChipsCounterRef.current.offsetParent);
      const scrollableParentRect = scrollableParent.getBoundingClientRect();
      const hiddenChipsCounterRect = (_hiddenChipsCounterRe2 = hiddenChipsCounterRef.current) === null || _hiddenChipsCounterRe2 === void 0 ? void 0 : _hiddenChipsCounterRe2.getBoundingClientRect();

      // Check if the hiddenChipsCounterRect is outside the boundaries of the scrollableParentRect or the window
      if (hiddenChipsCounterRect.left < scrollableParentRect.left || hiddenChipsCounterRect.top < scrollableParentRect.top || hiddenChipsCounterRect.right > scrollableParentRect.right || hiddenChipsCounterRect.bottom > scrollableParentRect.bottom || hiddenChipsCounterRect.right > window.innerWidth || hiddenChipsCounterRect.bottom > window.innerHeight) {
        setShowHiddenChips(false);
      }
    }
    if (!isEditMode && !(0, _common.isEveryObjectValueEmpty)(chipsSizes)) {
      var _chipsCellRef$current;
      const parentSize = (_chipsCellRef$current = chipsCellRef.current) === null || _chipsCellRef$current === void 0 ? void 0 : _chipsCellRef$current.getBoundingClientRect().width;
      let maxLength = 0;
      let chipIndex = 0;
      const padding = 65;
      Object.values(chipsSizes).every((chipSize, index) => {
        // Check if adding chipSize to maxLength exceeds parentSize
        // or if adding chipSize and padding exceeds parentSize when there are multiple chips
        if (maxLength + chipSize > parentSize || Object.values(chipsSizes).length > 1 && maxLength + chipSize + padding > parentSize) {
          chipIndex = index;
          return false;
        } else {
          maxLength += chipSize;
          if (index === Object.values(chipsSizes).length - 1) {
            chipIndex = 8;
          }
          return true;
        }
      });
      setVisibleChipsCount(chipIndex);
      setShowChips(true);
    }
  }, [chipsSizes, isEditMode]);
  (0, _react.useEffect)(() => {
    resizeChipCell();
  }, [resizeChipCell]);
  (0, _react.useEffect)(() => {
    const resizeChipCellDebounced = (0, _lodash.throttle)(resizeChipCell, 500);
    if (!isEditMode) {
      window.addEventListener('resize', resizeChipCellDebounced);
      window.addEventListener(transitionEndEventName, resizeChipCellDebounced);
      return () => {
        window.removeEventListener('resize', resizeChipCellDebounced);
        window.removeEventListener(transitionEndEventName, resizeChipCellDebounced);
      };
    }
  }, [resizeChipCell, isEditMode, transitionEndEventName]);
  return {
    chipsCellRef,
    chipsWrapperRef,
    handleShowElements,
    hiddenChipsCounterRef,
    hiddenChipsPopUpRef,
    setChipsSizes,
    setShowHiddenChips,
    showChips,
    showHiddenChips,
    visibleChipsCount
  };
};
exports.useChipCell = useChipCell;