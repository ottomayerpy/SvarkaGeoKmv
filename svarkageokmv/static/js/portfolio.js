$(function() {
    function create_portfolio() {
        var name = $('#in-name').val();
        var filename = $('#labelfile').text();
        var url = $('#in-url').val();
        var cost_from = $('#in-cost_from').val();
        var cost_to = $('#in-cost_to').val();

        $.ajax({
            url: 'createportfolio/',
            type: 'POST',
            data: {
                'name': name,
                'filename': filename,
                'url': url,
                'cost_from': cost_from,
                'cost_to': cost_to
            },
            success: function(result) {
                var res = JSON.parse(result);

                if (res['status'] == "success") {
                    $('#btnsendimg').click();
                } else {
                    if (res['text'] == "error-img-name") {
                        alert('Картинка с таким именем уже существует, переименуйте файл.');
                    } else {
                        alert(res['text']);
                        location.href = location.href;
                    }
                }
            }
        });
    }

    function delete_portfolio(id, image) {
        $.ajax({
            url: 'deleteportfolio/',
            type: 'POST',
            data: {
                'id': id,
                'image': image
            },
            success: function(result) {
                var res = JSON.parse(result);

                if (res['status'] != "success") {
                    alert(res['text']);
                }

                location.href = location.href;
            }
        });
    }

    $('#btnsendportfolio').on('click', function() {
        create_portfolio();
    });

    $('.btn-disslist').on('click', function() {
        if (confirm('Вы точно хотите удалить ' + $(this).attr('data-diss-name') + '?')) {
            delete_portfolio($(this).attr('data-diss-id'), $(this).attr('data-diss-image'));
        }
    });

    $('#inputfile').on('change', function() {
        $('#labelfile').text($(this).val().replace('C:\\fakepath\\', ''));
    });
});