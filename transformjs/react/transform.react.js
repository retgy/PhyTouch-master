/* transformjs 0.1.0
 * By june01
 * Github: https://github.com/AlloyTeam/PhyTouch/tree/master/transformjs
 */

'use strict';

import React from 'react';

/* thanks for dnt's Matrix3D */
class Matrix3D {
    constructor(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
        this.elements = window.Float32Array ? new Float32Array(16) : [];
        var te = this.elements;
        te[0] = (n11 !== undefined) ? n11 : 1; te[4] = n12 || 0; te[8] = n13 || 0; te[12] = n14 || 0;
        te[1] = n21 || 0; te[5] = (n22 !== undefined) ? n22 : 1; te[9] = n23 || 0; te[13] = n24 || 0;
        te[2] = n31 || 0; te[6] = n32 || 0; te[10] = (n33 !== undefined) ? n33 : 1; te[14] = n34 || 0;
        te[3] = n41 || 0; te[7] = n42 || 0; te[11] = n43 || 0; te[15] = (n44 !== undefined) ? n44 : 1;
    }

    static get DEG_TO_RAD() {
        return Math.PI / 180;
    }

    set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
        var te = this.elements;
        te[0] = n11; te[4] = n12; te[8] = n13; te[12] = n14;
        te[1] = n21; te[5] = n22; te[9] = n23; te[13] = n24;
        te[2] = n31; te[6] = n32; te[10] = n33; te[14] = n34;
        te[3] = n41; te[7] = n42; te[11] = n43; te[15] = n44;
        return this;
    }

    identity() {
        this.set(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
        return this;
    }

    multiplyMatrices(a, be) {

        var ae = a.elements;
        var te = this.elements;
        var a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
        var a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
        var a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
        var a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];

        var b11 = be[0], b12 = be[1], b13 = be[2], b14 = be[3];
        var b21 = be[4], b22 = be[5], b23 = be[6], b24 = be[7];
        var b31 = be[8], b32 = be[9], b33 = be[10], b34 = be[11];
        var b41 = be[12], b42 = be[13], b43 = be[14], b44 = be[15];

        te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

        te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

        te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

        te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
        te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
        te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
        te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

        return this;

    }

    // 解决角度为90的整数倍导致Math.cos得到极小的数，其实是0。导致不渲染
    _rounded(value, i) {
        i = Math.pow(10, i || 15);
        // default
        return Math.round(value * i) / i;
    }

    _arrayWrap(arr) {
        return window.Float32Array ? new Float32Array(arr) : arr;
    }

    appendTransform(x, y, z, scaleX, scaleY, scaleZ, rotateX, rotateY, rotateZ, skewX, skewY, originX, originY, originZ) {

        var rx = rotateX * Matrix3D.DEG_TO_RAD;
        var cosx = this._rounded(Math.cos(rx));
        var sinx = this._rounded(Math.sin(rx));
        var ry = rotateY * Matrix3D.DEG_TO_RAD;
        var cosy = this._rounded(Math.cos(ry));
        var siny = this._rounded(Math.sin(ry));
        var rz = rotateZ * Matrix3D.DEG_TO_RAD;
        var cosz = this._rounded(Math.cos(rz * -1));
        var sinz = this._rounded(Math.sin(rz * -1));

        this.multiplyMatrices(this, this._arrayWrap([
            1, 0, 0, x,
            0, cosx, sinx, y,
            0, -sinx, cosx, z,
            0, 0, 0, 1
        ]));

        this.multiplyMatrices(this, this._arrayWrap([
            cosy, 0, siny, 0,
            0, 1, 0, 0,
            -siny, 0, cosy, 0,
            0, 0, 0, 1
        ]));

        this.multiplyMatrices(this, this._arrayWrap([
            cosz * scaleX, sinz * scaleY, 0, 0,
            -sinz * scaleX, cosz * scaleY, 0, 0,
            0, 0, 1 * scaleZ, 0,
            0, 0, 0, 1
        ]));

        if (skewX || skewY) {
            this.multiplyMatrices(this, this._arrayWrap([
                this._rounded(Math.cos(skewX * Matrix3D.DEG_TO_RAD)), this._rounded(Math.sin(skewX * Matrix3D.DEG_TO_RAD)), 0, 0,
                -1 * this._rounded(Math.sin(skewY * Matrix3D.DEG_TO_RAD)), this._rounded(Math.cos(skewY * Matrix3D.DEG_TO_RAD)), 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]));
        }


        if (originX || originY || originZ) {
            this.elements[12] -= originX * this.elements[0] + originY * this.elements[4] + originZ * this.elements[8];
            this.elements[13] -= originX * this.elements[1] + originY * this.elements[5] + originZ * this.elements[9];
            this.elements[14] -= originX * this.elements[2] + originY * this.elements[6] + originZ * this.elements[10];
        }
        return this;
    }
}

var attrArr = ['translateX', 'translateY', 'translateZ', 'scaleX', 'scaleY', 'scaleZ', 'rotateX', 'rotateY', 'rotateZ', 'skewX', 'skewY', 'originX', 'originY', 'originZ'];
var otherArr = ['notPerspective', 'perspective'];
var propArr = [].concat(attrArr, otherArr);
var hasOwnProperty = ({}).hasOwnProperty;

function isDiff(o, n) {
    let diff = [];

    if((!o && n) || (o && !n)) {
        return true;
    } else if(n && o && o !== n) {
        for(let i=0,len=propArr.length; i<len; i++) {
            if(o[propArr[i]] !== n[propArr[i]]) {
                return true;
            }
        }
    }

    return false;
}

function isFilterProps(prop) {
    let filterProps = [].concat(propArr, ['children']);

    for(let i=0,len=filterProps.length; i<filterProps.length; i++) {
        if(filterProps[i] === prop) {
            return true;
        }
    }

    return false;
}

function getOtherProps(props) {
    let newProps = {};

    for(let i in props) {
        if(hasOwnProperty.call(props, i) && !isFilterProps(i)) {
            newProps[i] = props[i];
        }
    }

    return newProps;
}

function merge(o, n) {
    var obj = {};
    for(let i in o) obj[i] = o[i];
    for(let i in n) obj[i] = n[i];

    return obj;
}

export default class Transform extends React.Component {
    constructor(props) {
        super(props);

        this.matrix3D = new Matrix3D();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return isDiff(this.props, nextProps);
    }

    render() {
        let {
            notPerspective,
            perspective = 500
        } = this.props;

        let mtx = this.matrix3D.identity();
        let arr = attrArr.map((attr) => {
            let val = this.props[attr];
            if(!val) {
                return attr === 'scaleX' || attr === 'scaleY' || attr === 'scaleZ' ? 1 : 0;
            }

            return val;
        });
        mtx = mtx.appendTransform.apply(mtx, arr);

        let styleSheet = `${notPerspective ? '' : ('perspective(' + perspective + 'px)')} matrix3d(${Array.prototype.slice.call(mtx.elements).join(',')})`;

        let styleObj = {
            transform: styleSheet,
            msTransform: styleSheet,
            WebkitTransform: styleSheet,
            MozTransform: styleSheet,
            OTransform: styleSheet
        };

        let props = getOtherProps(this.props);
        if(props.style) {
            styleObj = merge(props.style, styleObj);
            delete props.style;
        }

        return <div style={styleObj} {...props}>
            {this.props.children}
        </div>;
    }
}