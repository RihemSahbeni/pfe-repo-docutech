import 'tui-image-editor/dist/tui-image-editor.css';
import ImageEditor from '@toast-ui/react-image-editor';
import { useRef, useState } from 'react';
import { saveAs } from 'file-saver';


export default function ImageElement({notifParentAdd,graphid,elementtype}){
    const [imageConfig, setImageConfig] = useState(null);
    const ref = useRef(null);

    const handleSave = (editor) => {
        const wrapper = ref.current.getInstance().toDataURL();;
        console.log(wrapper);
        notifParentAdd(wrapper,graphid,elementtype);

      };
    
    const myTheme = {
    'common.backgroundColor': '#fff',
      };
    return(
    <>
    {!imageConfig&&
    <>
    <ImageEditor
            ref={ref}

        includeUI={{
          loadImage: {
            path: 'assets/img/logoW.webp',
            name: 'SampleImage',
          },
          theme: myTheme,
          menu: ['filter', 'resize', 'crop', 'rotate'],
          initMenu: 'resize',
          uiSize: {
            width: '1000px',
            height: '700px',
          },
          menuBarPosition: 'right',
          download: false, // Disable default download behavior
        }}
        cssMaxHeight={500}
        cssMaxWidth={700}
        selectionStyle={{
          cornerSize: 20,
          rotatingPointOffset: 70,
        }}
        usageStatistics={true}
      />
      <button onClick={handleSave}>Save Image Config</button>
        </>
    }
      {/* Render any other components that depend on the image config */}
      {imageConfig && <img src={imageConfig} alt="edited image" />}
    </>

      )
      
      
}