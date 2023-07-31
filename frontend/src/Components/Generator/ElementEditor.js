import { useEffect, useRef, useState } from "react";
import { config_paragraphe, config_soustitre, config_tableau, config_titre } from "./configElements";
import { Editor } from "@tinymce/tinymce-react";
import ImageEditor from '@toast-ui/react-image-editor';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { confirm as Confirm } from "./Confirm";
import axios from "axios";

export default function ElementEditor({ element,back }) {

    const [Content, setContent] = useState(element.value.data);
    const [code,setCode]=useState(null);
    const [language,setlanguage]=useState(null);
    function save(){
        let data={}
        if(isCode){
            data={
                typeofvalue:language,
                value:code
            }
        }else if(isImage){
            const wrapper = ref.current.getInstance().toDataURL();
            data={
                value:wrapper
            }

        }else{
            data={
                value:Content
            }
        }
        const token = localStorage.getItem('token');

        const configapi={
              headers: {
                Authorization: `Bearer ${token}`,
              },
            
        }
        const  apibase="http://127.0.0.1:8000/api/elements"

        axios.put(`${apibase}/update-element/${element.id}`,data,configapi).then((reponse)=>{
            back();
          })


    }
    async function clear(){
        if (await Confirm("Êtes-vous sûr(e) ?")) {
            setlanguage("c");
            setCode("");
         }
    }
    const useDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isSmallScreen = window.matchMedia('(max-width: 1023.5px)').matches;
    const myTheme = {
        'common.backgroundColor': '#fff',
          };
    let config = {}
    let isCode=false;
    let isImage=false;

    switch (element.type) {
        case 'Titre':
          config = config_titre;
          break;
        case 'Sous-titre':
          config = config_soustitre;
          break;
        case 'Paragraphe':
          config = config_paragraphe;
          break;
        case 'Code':
          isCode=true;
          break;
        case 'Image':
            isImage=true;
                    break;
        case 'Tableau':
          config = config_tableau;
          break;
      }
    useEffect(()=>{
        if(isCode){
            setCode(element.value.data);
            setlanguage(element.typeofvalue);
        }
    },[])
    const generalconfig = {
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
    const ref = useRef(null);

    return (
        isImage ? (
            <>
            <ImageEditor
            ref={ref}

        includeUI={{
          loadImage: {
            path: element.value.data,
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
      <button className='btn btn-primary col-3 me-2' onClick={save}>Enregistrer</button>
      <button className='btn btn-primary col-3 me-2' onClick={back}>Annuler</button>

      </>
        ) : (isCode ? (
            <>
           {code!=null&&language!=null&&
           <>
            <div className='row my-3'>

            <div className='col-3'>
        <select class="form-select " onChange={(e)=>setlanguage(e.target.value)}>
        <option value="c">Language: c</option>
        <option value="abap">Language: abap</option>
        <option value="aes">Language: aes</option>
        <option value="apex">Language: apex</option>
        <option value="azcli">Language: azcli</option>
        <option value="bat">Language: bat</option>
        <option value="brainfuck">Language: brainfuck</option>
        <option value="cameligo">Language: cameligo</option>
        <option value="clike">Language: clike</option>
        <option value="clojure">Language: clojure</option>
        <option value="coffeescript">Language: coffeescript</option><option value="cpp">Language: cpp</option><option value="csharp">Language: csharp</option><option value="csp">Language: csp</option><option value="css">Language: css</option><option value="dart">Language: dart</option><option value="dockerfile">Language: dockerfile</option><option value="erlang">Language: erlang</option><option value="fsharp">Language: fsharp</option><option value="go">Language: go</option><option value="graphql">Language: graphql</option><option value="handlebars">Language: handlebars</option><option value="hcl">Language: hcl</option><option value="html">Language: html</option><option value="ini">Language: ini</option><option value="java">Language: java</option><option value="javascript" defaultChecked>Language: javascript</option><option value="json">Language: json</option><option value="jsx">Language: jsx</option><option value="julia">Language: julia</option><option value="kotlin">Language: kotlin</option><option value="less">Language: less</option><option value="lex">Language: lex</option><option value="livescript">Language: livescript</option><option value="lua">Language: lua</option><option value="markdown">Language: markdown</option><option value="mips">Language: mips</option><option value="msdax">Language: msdax</option><option value="mysql">Language: mysql</option><option value="nginx">Language: nginx</option><option value="objective-c">Language: objective-c</option><option value="pascal">Language: pascal</option><option value="pascaligo">Language: pascaligo</option><option value="perl">Language: perl</option><option value="pgsql">Language: pgsql</option><option value="php">Language: php</option><option value="plaintext">Language: plaintext</option><option value="postiats">Language: postiats</option><option value="powerquery">Language: powerquery</option><option value="powershell">Language: powershell</option><option value="pug">Language: pug</option><option value="python">Language: python</option><option value="r">Language: r</option><option value="razor">Language: razor</option><option value="redis">Language: redis</option><option value="redshift">Language: redshift</option><option value="restructuredtext">Language: restructuredtext</option><option value="ruby">Language: ruby</option><option value="rust">Language: rust</option><option value="sb">Language: sb</option><option value="scala">Language: scala</option><option value="scheme">Language: scheme</option><option value="scss">Language: scss</option><option value="shell">Language: shell</option><option value="sol">Language: sol</option><option value="sql">Language: sql</option><option value="st">Language: st</option><option value="stylus">Language: stylus</option><option value="swift">Language: swift</option><option value="systemverilog">Language: systemverilog</option><option value="tcl">Language: tcl</option><option value="toml">Language: toml</option><option value="tsx">Language: tsx</option><option value="twig">Language: twig</option><option value="typescript">Language: typescript</option><option value="vb">Language: vb</option><option value="vbscript">Language: vbscript</option><option value="verilog">Language: verilog</option><option value="vue">Language: vue</option><option value="xml">Language: xml</option><option value="yaml">Language: yaml</option>
        </select>
        </div>
        <button className='btn btn-primary col-3 me-2' onClick={save}>Enregistrer</button>
        <button className='btn btn-danger col-3' onClick={()=>clear()}>
        clear 
        </button>
        <button className='btn btn-primary col-3 me-2' onClick={back}>Annuler</button>

       
        </div>

            <CodeEditor
            value={code}
            language={language}
            placeholder={`Please enter ${language} code`}
            onChange={(evn) => setCode(evn.target.value)}
            padding={15}
            style={{
              fontSize: 20,
              backgroundColor: "#f5f5f5",
              fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
            }}
          />
          </>
          }
          </>
        ) : (
            <>
            <Editor
            apiKey='rxnixx6ht3s4aif0ykccu5lvvfmivj89dntscapd9m9zsw27'
            onInit={(evt, editor) => editorRef.current = editor}
            initialValue={Content}
            onChange={(e) => {console.log(e.target.getContent()); setContent(e.target.getContent())} }
  
            init={
              generalconfig
            }
            />
                  <button className='btn btn-primary col-3 me-2' onClick={save}>Enregistrer</button>
                  <button className='btn btn-secondary col-3 me-2' onClick={back}>Annuler</button>

            </>
        ))
    )

}