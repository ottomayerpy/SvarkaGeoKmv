$(function() {
    $("#in-phone").mask("+7(999) 999-9999"); // Устанавливаем маску на ввод номера телефона

    function upload() {
        var name = $('#in-name').text();
        var username = $('#in-username').val();
        var phone = $('#in-phone').val();
        var email = $('#in-email').val();
        var description = $('#txt-description').val();

        $.ajax({
            url: 'createorder/',
            type: 'POST',
            data: {
                'name': name,
                'username': username,
                'phone': phone,
                'email': email,
                'description': description
            },
            success: function(result) {
                var res = JSON.parse(result);

                if (res['status'] == "success") {
                    alert('Заказ принят, ожидайте нашего звонка.');
                    location.href = '/';
                }
                else {
                    alert(res['text']);
                    location.href = location.href;
                }
            }
        });
    }

    function delorder(id) {
        $.ajax({
            url: 'deleteorder/',
            type: 'POST',
            data: {
                'id': id,
            },
            success: function(result) {
                var res = JSON.parse(result);

                if (res['status'] == "success") {
                    var filter, val = $('#mt-status').val();
                    if (val == 'Активные') {
                        filter = 'True';
                    } else if (val == 'Не активные') {
                        filter = 'False';
                    } else if (val == 'Архив') {
                        filter = 'Arhive';
                    }
                    location.href = location.href.substr(0, location.href.indexOf('?') - 1) + '?filteractive=' + filter;
                }
                else {
                    alert(res['text']);
                    location.href = location.href;
                }
            }
        });
    }

    function changestatus(id, status, typestatus) {
        $.ajax({
            url: 'changestatus/',
            type: 'POST',
            data: {
                'id': id,
                'status': status,
                'typestatus': typestatus
            },
            success: function(result) {
                var res = JSON.parse(result);

                if (res['status'] == "success") {
                    var filter, val = $('#mt-status').val();
                    if (val == 'Активные') {
                        filter = 'True';
                    } else if (val == 'Не активные') {
                        filter = 'False';
                    } else if (val == 'Архив') {
                        filter = 'Arhive';
                    }
                    location.href = location.href.substr(0, location.href.indexOf('?') - 1) + '?filteractive=' + filter;
                }
                else {
                    alert(res['text']);
                    location.href = location.href;
                }
            }
        });
    }

    $('#btnordersend').on('click', function() {
        var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;

        if ($('#in-username').val() != '') {
            if ($('#txt-description').val() != '') {
                if ($('#in-phone').val() != '') {
                    if ($('#in-email').val() != '') {
                        if (!testEmail.test($('#in-email').val())) {
                            alert('Почта введена не верно');
                            return false;
                        }
                    } else {
                        alert('Заполните поле "Почта"');
                        return false;
                    }
                } else {
                    alert('Заполните поле "Телефон"');
                    return false;
                }
            } else {
                alert('Заполните поле "Описание"');
                return false;
            }
        } else {
            alert('Заполните поле "Имя"');
            return false;
        }

        upload();
    });

    $('.btn-disslist').on('click', function() {
        if (confirm('Вы точно хотите удалить заказ под номером ' + $(this).attr('data-diss-id') + '?')) {
            delorder($(this).attr('data-diss-id'));
        }
    });

    $('.btn-pagelist').on('click', function() {
        $('#pages').val($(this).attr('data-page'));
        $('#btnsendpage').click();
    });

    $('#mt-status').on('change', function() {
        if ($(this).val() == 'Активные') {
            $('#filteractive').val('True');
        } else if ($(this).val() == 'Не активные') {
            $('#filteractive').val('False');
        } else if ($(this).val() == 'Архив') {
            $('#filteractive').val('Arhive');
        } else {
            $('#filteractive').val('All');
        }
        $('#pages').val('1');
        $('#btnsendpage').click();
    });

    $('.btn-worklist').on('click', function() {
        var message = '';

        if ($(this).attr('data-status') == 'false') {
            message = 'де';
        }

        if (confirm('Вы точно хотите ' + message + 'активировать заказ под номером ' + $(this).attr('data-diss-id') + '?')) {
            changestatus($(this).attr('data-diss-id'), $(this).attr('data-status'), 'is_work');
        }
    });

    $('.btn-arhivelist').on('click', function() {
        var message = '';

        if ($(this).attr('data-status') == 'false') {
            message = 'де';
        }

        if (confirm('Вы точно хотите ' + message + 'архивировать заказ под номером ' + $(this).attr('data-diss-id') + '?')) {
            changestatus($(this).attr('data-diss-id'), $(this).attr('data-status'), 'is_arhive');
        }
    });

    $('#ShowOrderModal').on('show.bs.modal', function(event) {
        var button = $(event.relatedTarget);
        var id = button.attr('data-id');

        var name = $('.order-name[data-id="' + id + '"]').text();
        var username = $('.order-username[data-id="' + id + '"]').text();
        var created_date = $('.order-created_date[data-id="' + id + '"]').text();
        var phone = $('.order-phone[data-id="' + id + '"]').text();
        var email = $('.order-email[data-id="' + id + '"]').text();
        var is_work = $('.order-is_work[data-id="' + id + '"]').text();
        var description = $('.order-description[data-id="' + id + '"]').text();
        var is_arhive = $('.order-is_arhive[data-id="' + id + '"]').text();

        $(this).find('.modal-title').text('Заказ №' + id + ' на ' + name + ' для ' + username + ' (' + created_date + ')');
        $(this).find('#modal-phone').text(phone);
        $(this).find('#modal-email').text(email);
        $(this).find('#modal-is_work').text(is_work);
        $(this).find('#modal-description').text(description);

        $(this).find('#modal-btn-delete').attr('data-diss-id', id);
        $(this).find('#modal-btn-active').attr('data-diss-id', id);
        $(this).find('#modal-btn-deactive').attr('data-diss-id', id);
        $(this).find('#modal-btn-arhive').attr('data-diss-id', id);
        $(this).find('#modal-btn-dearhive').attr('data-diss-id', id);

        if (is_work == 'Да') {
            $(this).find('#modal-btn-active').css('display', 'none');
            $(this).find('#modal-btn-deactive').css('display', 'inline-block');
        } else {
            $(this).find('#modal-btn-active').css('display', 'inline-block');
            $(this).find('#modal-btn-deactive').css('display', 'none');
        }

        if (is_arhive == 'Да') {
            $(this).find('#modal-btn-arhive').css('display', 'none');
            $(this).find('#modal-btn-dearhive').css('display', 'inline-block');
            $(this).find('#modal-btn-delete').css('display', 'inline-block');
            $(this).find('#modal-btn-deactive').css('display', 'none');
            $(this).find('#modal-btn-active').css('display', 'none');
        } else {
            $(this).find('#modal-btn-arhive').css('display', 'inline-block');
            $(this).find('#modal-btn-dearhive').css('display', 'none');
            $(this).find('#modal-btn-delete').css('display', 'none');
        }
    });
});