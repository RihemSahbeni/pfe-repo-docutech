
let config_titre={
    plugins: 'preview importcss searchreplace autolink autosave save directionality',
    menubar: '',
    toolbar: 'undo redo | bold italic underline strikethrough fontfamily fontsize forecolor backcolor removeformat alignleft aligncenter alignright alignjustify ',
    height: 300,
    initialValue:"<h1>Title<h1/>",
    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',

    
  }
  let config_soustitre={
    plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
    menubar: '',
    toolbar: 'undo redo | bold italic underline strikethrough fontfamily fontsize forecolor backcolor removeformat alignleft aligncenter alignright alignjustify ',
    height: 300,
    initialValue:"<h3>Title</h3>",
    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote ',

   
  }
  let config_paragraphe={
    plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
    menubar: 'edit insert format ',
    toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat  | charmap emoticons | fullscreen  preview | image media template link anchor | ltr rtl',
    initialValue:"<p>Your texte here </p>",
    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
    height: 600,

}
  
 
let config_image={
    plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
    menubar: 'file edit view insert format tools table help',
    toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
    height: 600,
   

  }
  let config_tableau={
    plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
    menubar: 'table ',
    toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent | fullscreen  preview | insertfile image link',
    height: 600,


  }
  let config_BreakPage={
    plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
    menubar: 'file edit view insert format tools table help',
    toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
    height: 600,

  }

export{config_titre,config_soustitre,
    config_paragraphe,config_image,config_tableau,config_BreakPage}