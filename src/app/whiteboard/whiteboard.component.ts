import { Component, OnInit } from '@angular/core';
import { inherits } from 'util';

declare var DrawerJs: any;

@Component({
  selector: 'app-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.css']
})

export class WhiteboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    let imgwidth = $(window).outerWidth() - 105;
    let drawerPlugins = [
      // Drawing tools
      'Pencil',
      'Eraser',
      'Text',
      // 'Line',
      // 'ArrowOneSide',
      // 'ArrowTwoSide',
      'Triangle',
      'Rectangle',
      'Circle',
      'Image',
      'BackgroundImage',
      'Polygon',
      'ImageCrop',

      // Drawing options
      //'ColorHtml5',
      'Color',
      'ShapeBorder',
      'BrushSize',
      'OpacityOption',

      'LineWidth',
      'StrokeWidth',

      'Resize',
      'ShapeContextMenu',
      'CloseButton',
      'OvercanvasPopup',
      'OpenPopupButton',
      'MinimizeButton',
      'ToggleVisibilityButton',
      'MovableFloatingMode',
      'FullscreenModeButton',
      'Zoom',

      'TextLineHeight',
      'TextAlign',

      'TextFontFamily',
      'TextFontSize',
      'TextFontWeight',
      'TextFontStyle',
      'TextDecoration',
      'TextColor',
      'TextBackgroundColor'
    ];

    let draw = new DrawerJs.Drawer(null, {
      plugins: drawerPlugins,
      pluginsConfig: {
        Image: {
          scaleDownLargeImage: true,
          maxImageSizeKb: 10240, //1MB
          cropIsActive: true
        },
        BackgroundImage: {
          scaleDownLargeImage: true,
          maxImageSizeKb: 10240, //1MB
          //fixedBackgroundUrl: '/examples/redactor/images/vanGogh.jpg',
          imagePosition: 'center',  // one of  'center', 'stretch', 'top-left', 'top-right', 'bottom-left', 'bottom-right'
          acceptedMIMETypes: ['image/jpeg', 'image/png', 'image/gif'],
          dynamicRepositionImage: true,
          dynamicRepositionImageThrottle: 100,
          cropIsActive: false
        },
        Text: {
          editIconMode: false,
          editIconSize: 'large',
          defaultValues: {
            fontSize: 72,
            lineHeight: 2,
            textFontWeight: 'bold'
          },
          predefined: {
            fontSize: [8, 12, 14, 16, 32, 40, 72],
            lineHeight: [1, 2, 3, 4, 6]
          }
        },
        Zoom: {
          enabled: true,
          showZoomTooltip: true,
          useWheelEvents: true,
          zoomStep: 1.05,
          defaultZoom: 1,
          maxZoom: 32,
          minZoom: 1,
          smoothnessOfWheel: 0,
          //Moving:
          enableMove: true,
          enableWhenNoActiveTool: true,
          enableButton: true
        }
      },
      toolbars: {
        drawingTools: {
          position: 'top',
          positionType: 'inside',
          customAnchorSelector: '#custom-toolbar-here',
          compactType: 'scrollable',
          hidden: false,
          toggleVisibilityButton: false,
          fullscreenMode: {
            position: 'top',
            hidden: false,
            toggleVisibilityButton: false
          }
        },
        toolOptions: {
          position: 'bottom',
          positionType: 'inside',
          compactType: 'popup',
          hidden: false,
          toggleVisibilityButton: false,
          fullscreenMode: {
            position: 'bottom',
            compactType: 'popup',
            hidden: false,
            toggleVisibilityButton: false
          }
        },
        settings: {
          position: 'right',
          positionType: 'inside',
          compactType: 'scrollable',
          hidden: false,
          toggleVisibilityButton: false,
          fullscreenMode: {
            position: 'right',
            hidden: false,
            toggleVisibilityButton: false
          }
        }
      },
      defaultImageUrl: '../../assets/images/clickhere.PNG',
      defaultActivePlugin: { name: 'Pencil', mode: 'lastUsed' },
      debug: true,
      activeColor: '#a1be13',
      transparentBackground: true,
      align: 'floating',  //one of 'left', 'right', 'center', 'inline', 'floating'
      lineAngleTooltip: { enabled: true, color: 'blue', fontSize: 15 }
    }, imgwidth, 600);
    $('#canvas-editor').append(draw.getHtml());
    draw.onInsert();

    let canvasEditor = document.getElementById("canvas-editor");
    (<HTMLImageElement>canvasEditor.firstChild).src = "../../assets/images/clickhere.PNG"
  }
}
