/***
 * 图片覆盖物类，用于添加一个只有一张图片的图层，图片会随缩放级别而自适应缩放。
 *@author juyang
 * **/

T.ImageOverlay = T.Overlay.extend({

    options: {
        opacity: 1,//透明度
        alt: ''
    },


    /**
     *
     * @param url  图片的url。
     * @param bounds 图片的坐标范围。
     * @param options \

     */
    initialize: function (url, bounds, options) {
        this._url = url;
        this._bounds = bounds;
        T.setOptions(this, options);
    },
    /**
     *增加图片容器
     * @param map 地图对象
     */
    onAdd: function (map) {
        this._map = map;
        if (!this._image) {
            this._initImage();
            this._update();
            if (this.options.opacity < 1) {
                this._updateOpacity();
            }
        }
        this._map.on("zoomend", this._update, this)
        this._map.getPanes().overlayPane.appendChild(this._image);

    },
    onRemove: function () {
        this._map.off("zoomend", this._update, this)
        this._map.getPanes().overlayPane.removeChild(this._image);
        this.map = null;
        this._image = null;
    },
    /**
     * 设置透明度
     * @param opacity
     * @returns {T.ImageOverlay}
     */

    setOpacity: function (opacity) {
        this.options.opacity = opacity;

        if (this._image) {
            this._updateOpacity();
        }
        return this;
    },
    getOpacity: function () {
        return this.options.opacity ;
    },
    /**
     * 设置图片的url
     * @param url
     * @returns {T.ImageOverlay}
     */

    setImageUrl: function (url) {
        this._url = url;
        if (this._image) {
            this._image.src = url;
        }
        return this;

    },
    /**
     * 获取图片的url
     * @returns {*}
     */
    getImageUrl :function () {
        return this._url;

    },
    /**
     * 设置图片的覆盖范围
     * @param bounds
     */
    setBounds: function (bounds) {
        this._bounds = bounds;
        if (this._bounds) {
            this._update();
        }
    },
    /**
     * 获取图片的覆盖范围
     * @param bounds
     */
    getBounds: function () {
        return this._bounds;
    },

    getElement: function () {
        return this._image;
    },

    /**
     * 构建图片的容器
     * @private
     */

    _initImage: function () {
        var img = this._image = this.create('img',
            'tdt-image-layer ' + (this._zoomAnimated ? 'tdt-zoom-animated' : ''));
        img.src = this._url;
        img.alt = this.options.alt;

    },

    /**
     * 更新透明度
     * @private
     */
    _updateOpacity: function () {

        var el = this._image;
        if ('opacity' in el.style) {
            el.style.opacity = this.options.opacity;
        }
        else if ('filter' in el.style) {
            this._setOpacityIE(el, this.options.opacity);
        }


    },


    _setOpacityIE: function (el, value) {
        var filter = false,
            filterName = 'DXImageTransform.Microsoft.Alpha';
        try {
            filter = el.filters.item(filterName);
        } catch (e) {
            if (value === 1) {
                return;
            }
        }
        value = Math.round(value * 100);
        if (filter) {
            filter.Enabled = (value !== 100);
            filter.Opacity = value;
        } else {
            el.style.filter += ' progid:' + filterName + '(opacity=' + value + ')';
        }
    },

    /**
     *
     * @param tagName 元素名称
     * @param className css样式名称
     * @param container 容器
     * @returns {Element}
     */
    create: function (tagName, className, container) {
        var el = document.createElement(tagName);
        el.className = className || '';
        if (container) {
            container.appendChild(el);
        }
        return el;
    },

    //更新图片容器像素位置
    _update: function () {
        var image = this._image;
        var p1 = this._map.lngLatToLayerPoint(this._bounds.getNorthEast());
        var p2 = this._map.lngLatToLayerPoint(this._bounds.getSouthWest());
        var xt = Math.abs(p1.x - p2.x)
        var yt = Math.abs(p1.y - p2.y)
        image.style.left = p2.x + "px";
        image.style.top = p1.y + "px";
        image.style.width = xt + 'px';
        image.style.height = yt + 'px';

    },


    /**
     * 图片移动到最顶层
     * @returns {T.ImageOverlay}
     */
    bringToFront: function () {
        if (this._image) {
            this._image.parentNode.appendChild(this._image);
        }
        return this;

    },

    /**
     * 图片移动到最底层
     * @returns {T.ImageOverlay}
     */
    bringToBack: function () {
        if (this._image) {
            var parent = this._image.parentNode;
            parent.insertBefore(this._image, parent.firstChild);

        }
        return this;

    }

})
