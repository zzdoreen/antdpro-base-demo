(self.webpackChunkant_design_pro=self.webpackChunkant_design_pro||[]).push([[156],{66553:function(h,s,e){"use strict";e.r(s),e.d(s,{default:function(){return c}});var x=e(7359),u=e(27279),o=e(12215),d=e(53961),i=e(99802),n=e(85893),a=[{name:"\u53D8\u91CF\u590D\u7528",code:`
            {
                @color: rgb(199, 138, 170);
                @first-content: content;

                .@{first-content} {
                    width: 100px;
                    height: $width;
                    background-color: @color;
                }
            }`},{name:" :extend \u590D\u7528\u6837\u5F0F(\u7EE7\u627F)",code:`
        .border-style {
            border: 5px solid salmon;
        }
        &:nth-of-type(2){
            .content {
                // =>  .border-style,.content {}
                &:extend(.border-style); 
                width: 200px;
                height: 200px;
            }
        }`},{name:" mixin \u51CF\u5C11\u91CD\u590D\u6837\u5F0F\u7F16\u5199",code:`
        .borderStyle() {
            // \u5E26\u62EC\u53F7\u4E0D\u4F1A\u8F93\u51FA\u8BE5\u6837\u5F0F\uFF0C\u4E0D\u5E26\u7684\u8BDD\u4F1A\u7559\u5728css\u6837\u5F0F\u4E2D
            background-color: lightgreen;
            border-radius: 50%;
        }

        #boxSize(@widths: 100px) {
            width: @widths;
            height: @widths;
        }

        .box-shadow(@x: 0, @y: 0, @blur: 2px, @color: #000) {
            box-shadow: @arguments; // mixin\u4F20\u9012\u7684\u6240\u6709\u53C2\u6570
        }

        &:nth-of-type(3) {
            .content {
                .borderStyle() !important;
                #boxSize(150px);
                .box-shadow;
            }
        }`},{name:"\u6620\u5C04",code:`
        {
            @backgroundColor: {
                primary: green;
                error: red;
            }

            .content {
                background-color: @backgroundColor[primary];
                width: 100px;
                height: $width;
            }
        }`}];function c(){return(0,n.jsxs)("div",{children:[(0,n.jsx)("div",{className:"title",children:"Less\uFF08Leaner Style Sheets \u7684\u7F29\u5199\uFF09\u662F\u4E00\u79CD\u5411\u540E\u517C\u5BB9\u7684 CSS \u8BED\u8A00\u6269\u5C55\u3002Less.js \u662F\u5C06 Less \u6837\u5F0F\u8F6C\u6362\u4E3A CSS \u6837\u5F0F\u7684 JavaScript \u5DE5\u5177\u3002"}),(0,n.jsx)("div",{className:"container",children:a.map(function(r){var t=r.name,l=r.code;return(0,n.jsxs)("div",{className:"item",children:[(0,n.jsxs)(o.LG,{style:{padding:30,height:400},color:["#ddd","#ccc"],children:[(0,n.jsx)("h1",{children:t}),(0,n.jsx)("div",{className:"content"+(t===" :extend \u590D\u7528\u6837\u5F0F(\u7EE7\u627F)"?" border-style":"")})]}),(0,n.jsx)(u.Z,{children:(0,n.jsx)(u.Z.Panel,{header:"code",children:(0,n.jsx)(d.Z,{language:"less",style:i.Z,children:l})},t)})]},t)})})]})}}}]);
