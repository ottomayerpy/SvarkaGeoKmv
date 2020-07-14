$(function() {
  function upload() {
    var hreffile = $('#hrefurl').attr('href').replace('/media/', '');
    $('#upload-image').attr('src','/static/img/loading.gif');
    $.ajax({
      url: 'startimport/',
      type: 'POST',
      data: {'filename':hreffile},
      success: function(result) {
        var res = JSON.parse(result);

        if (res['status'] == "success") {
            window.location = "/calculator";
        }
        else {
            alert(res['text']);
            location.href = location.href;
        }
      }
    });
  }

  upload();

  $('#inputfile').on('change', function(){
    $('label').text($(this).val().replace('C:\\fakepath\\', ''));
  });
});
