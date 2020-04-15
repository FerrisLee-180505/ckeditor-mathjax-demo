/**
 * Created by chenzuopeng on 15-5-27.
 */
CKEDITOR.plugins.add( 'kityformula', {
    icons: 'kityformula',
    init: function( editor ) {
        editor.addCommand( 'kityformula', new CKEDITOR.dialogCommand( 'kityformulaDialog',{
            allowedContent:'img[data-latex]' //此设置必须,否则在将公式信息写入唱keditor编辑器时图片元素的data-latex属性会被删除.
        }) );
        editor.ui.addButton( 'kityformula', {
            label: '公式编辑器',
            command: 'kityformula',
            toolbar: 'insert'
        });
        CKEDITOR.dialog.add( 'kityformulaDialog', this.path + 'dialogs/kityformula.js' );        
        //在右键菜单中添加公式编辑项
        if ( editor.contextMenu ) {
            editor.addMenuGroup( 'kityformulaGroup' );
            editor.addMenuItem( 'kityformulaItem', {
                label: '编辑公式',
                icon: this.path + 'icons/kityformula.png',
                command: 'kityformula',
                group: 'kityformulaGroup'
            });
            editor.contextMenu.addListener( function( element ) {
                if ( element.getAscendant( 'img', true ) && element.hasClass("kfformula") ) {
                    return { kityformulaItem: CKEDITOR.TRISTATE_OFF };
                }
            });
        }

        //双击公式打开公式编辑器
        editor.on( 'doubleclick', function( evt ) {
            var element = evt.data.element;
            if ( element.is( 'img' ) && element.hasClass("kfformula") ){
                evt.data.dialog = "kityformulaDialog";
            }
        } );
    }
});