import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function Element({config,notifParentAdd,graphid,elementtype}){
  const [viewMode,setViewMode]=useState("edit");
  const [Content,setContent]=useState(config.initialValue);
 
    const useDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isSmallScreen = window.matchMedia('(max-width: 1023.5px)').matches;
  
  const generalconfig={
            plugins: config.plugins,
  editimage_cors_hosts: ['picsum.photos'],
  menubar: config.menubar,
  toolbar: config.toolbar,
    toolbar_sticky: false,
  toolbar_sticky_offset: isSmallScreen ? 102 : 108,
  autosave_ask_before_unload: true,
  autosave_interval: '30s',
  autosave_prefix: '{path}{query}-{id}-',
  autosave_restore_when_empty: false,
  autosave_retention: '2m',
  image_advtab: true,
  link_list: [
    { title: 'My page 1', value: 'https://www.tiny.cloud' },
    { title: 'My page 2', value: 'http://www.moxiecode.com' }
  ],
  image_list: [
    { title: 'My page 1', value: 'https://www.tiny.cloud' },
    { title: 'My page 2', value: 'http://www.moxiecode.com' }
  ],
  image_class_list: [
    { title: 'None', value: '' },
    { title: 'Some class', value: 'class-name' }
  ],
  importcss_append: true,
  file_picker_callback: (callback, value, meta) => {
    if (meta.filetype === 'file') {
      callback('https://www.google.com/logos/google.jpg', { text: 'My text' });
    }

    if (meta.filetype === 'image') {
      callback('https://www.google.com/logos/google.jpg', { alt: 'My alt text' });
    }

    if (meta.filetype === 'media') {
      callback('movie.mp4', { source2: 'alt.ogg', poster: 'https://www.google.com/logos/google.jpg' });
    }
  },
  templates: [
    { title: 'New Table', description: 'creates a new table', content: '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>' },
    { title: 'Starting my story', description: 'A cure for writers block', content: 'Once upon a time...' },
    { title: 'New list with dates', description: 'New List with dates', content: '<div class="mceTmpl"><span class="cdate">cdate</span><br><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>' }
  ],
  template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
  template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
  height: config.height,
  image_caption: true,
  quickbars_selection_toolbar: config.quickbars_selection_toolbar,
  noneditable_class: 'mceNonEditable',
  toolbar_mode: 'sliding',
  contextmenu: 'link image table',
  skin: useDarkMode ? 'oxide-dark' : 'oxide',
  content_css: useDarkMode ? 'dark' : 'default',
  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
  
          }
  
      const editorRef = useRef(null);
   
    return(
        <>
          {viewMode=="edit"?(
            <>
            <div className='row'>
            <div className='btn btn-primary col-3' onClick={()=>notifParentAdd(Content,graphid,elementtype)}>Enregistrer</div>
            </div>
        <Editor
          apiKey='rxnixx6ht3s4aif0ykccu5lvvfmivj89dntscapd9m9zsw27'
          onInit={(evt, editor) => editorRef.current = editor}
          initialValue={Content}
          onChange={(e) => {console.log(e.target.getContent()); setContent(e.target.getContent())} }

          init={
            generalconfig
          }
        />
        </>):(
          <>
          <div className='row'>
          <div className="d-flex flex-row-reverse">
          <i class="bi bi-pencil-square" onClick={()=>setViewMode("edit")}></i>
                    </div>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html:           Content
 }} />

          </>
        )}
      </>
    )
}