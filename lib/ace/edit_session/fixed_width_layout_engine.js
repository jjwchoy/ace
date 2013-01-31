define(function(require, exports, module) {
"use strict";

var lang = require("./lib/lang");

function FixedWidthLayoutEngine(isFullWidth) {
    this.$useSoftTabs = true;
    this.$tabSize = 4;
}

(function() {
    this.getStringScreenWidth = function(str, maxScreenColumn, screenColumn) {
        var c, column;
        for (column = 0; column < str.length; column++) {
            c = str.charCodeAt(column);
            // tab
            if (c == 9) {
                screenColumn += this.getScreenTabSize(screenColumn);
            }
            // full width characters
            else if (c >= 0x1100 && isFullWidth(c)) {
                screenColumn += 2;
            } else {
                screenColumn += 1;
            }
            if (screenColumn > maxScreenColumn) {
                break;
            }
        }

        return [screenColumn, column];
    };

    /**
    * Returns the current value for tabs. If the user is using soft tabs, this will be a series of spaces (defined by [[EditSession.getTabSize `getTabSize()`]]); otherwise it's simply `'\t'`.
    **/
    this.getTabString = function() {
        if (this.getUseSoftTabs()) {
            return lang.stringRepeat(" ", this.getTabSize());
        } else {
            return "\t";
        }
    };

    /**
    * Pass `true` to enable the use of soft tabs. Soft tabs means you're using spaces instead of the tab character (`'\t'`).
    * @param {Boolean} useSoftTabs Value indicating whether or not to use soft tabs
    *
    *
    *
    **/
    this.setUseSoftTabs = function(useSoftTabs) {
        if (this.$useSoftTabs === useSoftTabs) return;

        this.$useSoftTabs = useSoftTabs;
    };

    /**
    * Returns `true` if soft tabs are being used, `false` otherwise.
    * @returns {Boolean}
    **/
    this.getUseSoftTabs = function() {
        return this.$useSoftTabs;
    };

    /**
    * Set the number of spaces that define a soft tab; for example, passing in `4` transforms the soft tabs to be equivalent to four spaces. This function also emits the `changeTabSize` event.
    * @param {Number} tabSize The new tab size
    *
    *
    **/
    this.setTabSize = function(tabSize) {
        if (isNaN(tabSize) || this.$tabSize === tabSize) return;

        this.$modified = true;
        this.$rowLengthCache = [];
        this.$tabSize = tabSize;
        this._emit("changeTabSize");
    };

    /**
    * Returns the current tab size.
    **/
    this.getTabSize = function() {
        return this.$tabSize;
    };

    /**
    * Returns `true` if the character at the position is a soft tab.
    * @param {Object} position The position to check
    *
    *
    **/
    this.isTabStop = function(position) {
        return this.$useSoftTabs && (position.column % this.$tabSize == 0);
    };


    /**
    * The distance to the next tab stop at the specified screen column.
    * @param {Number} screenColumn The screen column to check
    *
    * 
    * @returns {Number}
    **/
    this.getScreenTabSize = function(screenColumn) {
        return this.$tabSize - screenColumn % this.$tabSize;
    };


    /**
     * @private
     *
     */
    function isFullWidth(c) {
        if (c < 0x1100)
            return false;
        return c >= 0x1100 && c <= 0x115F ||
               c >= 0x11A3 && c <= 0x11A7 ||
               c >= 0x11FA && c <= 0x11FF ||
               c >= 0x2329 && c <= 0x232A ||
               c >= 0x2E80 && c <= 0x2E99 ||
               c >= 0x2E9B && c <= 0x2EF3 ||
               c >= 0x2F00 && c <= 0x2FD5 ||
               c >= 0x2FF0 && c <= 0x2FFB ||
               c >= 0x3000 && c <= 0x303E ||
               c >= 0x3041 && c <= 0x3096 ||
               c >= 0x3099 && c <= 0x30FF ||
               c >= 0x3105 && c <= 0x312D ||
               c >= 0x3131 && c <= 0x318E ||
               c >= 0x3190 && c <= 0x31BA ||
               c >= 0x31C0 && c <= 0x31E3 ||
               c >= 0x31F0 && c <= 0x321E ||
               c >= 0x3220 && c <= 0x3247 ||
               c >= 0x3250 && c <= 0x32FE ||
               c >= 0x3300 && c <= 0x4DBF ||
               c >= 0x4E00 && c <= 0xA48C ||
               c >= 0xA490 && c <= 0xA4C6 ||
               c >= 0xA960 && c <= 0xA97C ||
               c >= 0xAC00 && c <= 0xD7A3 ||
               c >= 0xD7B0 && c <= 0xD7C6 ||
               c >= 0xD7CB && c <= 0xD7FB ||
               c >= 0xF900 && c <= 0xFAFF ||
               c >= 0xFE10 && c <= 0xFE19 ||
               c >= 0xFE30 && c <= 0xFE52 ||
               c >= 0xFE54 && c <= 0xFE66 ||
               c >= 0xFE68 && c <= 0xFE6B ||
               c >= 0xFF01 && c <= 0xFF60 ||
               c >= 0xFFE0 && c <= 0xFFE6;
    };
}).call(FixedWidthLayoutEngine.prototype);

exports.FixedWidthLayoutEngine = FixedWidthLayoutEngine;
});
