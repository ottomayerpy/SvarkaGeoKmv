$(function() {
    var total_sum = 0.0; // Итоговая сумма
    var total_sum_with_percent = 0.0; // Итоговая сумма с процентами

    function Calculate() { // Вычисление текущего выбора
        var clqty = $('#mt-qty').val(), // Кол-во материала
            clcost = $("#mt-size option:selected").attr('cost'), // Стоимость материала
            clsum = clcost * clqty;
        $('#cl-qty').text(clqty);
        $('#cl-cost').text(clcost);

        $('#cl-sum').attr('floatVal', clsum) // Обновляем атрибут в котором хранится полноценное число без округления
        $('#cl-sum').text(parseFloat(clsum).toFixed(2)); // А для пользователя округляем до 2 знаков после точки
    }

    function CalcPercent(int) { // Вычисление процента
        if ($('#mt-percent').val() == '0') {
            return int; // Если его нет то возвращаем это же число
        }

        var percent = $('#mt-percent').val(); // Сам процент
        var mathchar = $('#mt-mathchar').val(); // Математический знак (плюс или минус)

        if (mathchar == '+') {
            return parseFloat(int) + parseFloat(int) * parseFloat(percent) / 100;
        } else if (mathchar == '-') {
            return parseFloat(int) - parseFloat(int) * parseFloat(percent) / 100;
        } else { // В принципе не особо нужно, мало вероятно что будет знак отличный от ожидаемых, но все же на всякий случай оставил
            return 'Error function CalcPercent';
        }
    }

    function additem() { // Добавление текущего элемента в итоговую таблицу
        var title, cost, qty, lencount, newbutton;
        title = $('#mt-type').val() + ' ' + $('#mt-size').val();
        qty = $('#cl-qty').text();
        cost = $('#cl-sum').text();
        lencount = $('.table-productlist').find('tr').length;
        newbutton = '<button type="button" class="btn btn-danger btn-round btn-disslist" data-diss-id="' + lencount + '">X</button>'
        $('.table-productlist').append('<tr class="trproduct" data-id="' + lencount + '"><td>' + title + '</td><td class="tdqtyproduct">' + qty + '</td><td data-id="' + lencount + '" floatVal="' + cost + '" class="tdcostproduct">' + cost + ' руб.</td></tr>');
        $('.table-productlist').find('tr[data-id="' + lencount + '"]').append(newbutton);
        total_sum += parseFloat($('#cl-sum').attr('floatVal'));
        total_sum_with_percent = CalcPercent(total_sum);
        var notpercent = '';
        if ($('#mt-percent').val() != 0) {
            notpercent = ' (' + parseFloat(total_sum).toFixed(2) + ' без %)';
        }
        $('#tdtotalsum').replaceWith('<td floatVal="' + parseFloat(total_sum_with_percent) + '" id="tdtotalsum">' + parseFloat(total_sum_with_percent).toFixed(2) + ' руб.' + notpercent + '</td>');
    }

    function renumberlist() { // Перенумерация элементов в итоговой таблице
        $('.trproduct').each(function(i, elem) {
            $(this).attr('data-id', i);
            $(this).find('.tdcostproduct').attr('data-id', i);
            $(this).find('button').attr('data-diss-id', i);
        });
    }

    function recalcpercent() {
        total_sum_with_percent = CalcPercent(total_sum);

        var notpercent = '';
        if ($('#mt-percent').val() != 0) {
            notpercent = ' (' + parseFloat(total_sum).toFixed(2) + ' без %)';
        }

        $('#tdtotalsum').replaceWith('<td floatVal="' + parseFloat(total_sum_with_percent) + '" id="tdtotalsum">' + parseFloat(total_sum_with_percent).toFixed(2) + ' руб.' + notpercent + '</td>');
    }

    function formatinput(control, input) { // Форматирование строки для input-ов
        var vl = control.val();

        if (input == 'qty' && vl == '0') {
            control.val(1);
        } else if (vl == '') {
            if (input == 'qty') {
                control.val(1);
                Calculate();
            } else {
                control.val(0);
                recalcpercent();
            }
            control.removeClass('invalidinput');
            return false;
        } else if (vl[0] == '0') {
            if (vl[1] == '.' || vl[1] === undefined) {
                return false;
            }
            control.val(vl.substr(1));
            formatinput(control, input);
        } else {
            if (vl[0] == '.') {
                control.val(vl.substr(1));
                formatinput(control, input);
            }
        }
    }

    $('#reportbtn').on('click', function() {
        if (!window.Blob) {
            alert('Your legacy browser does not support this action.');
            return;
        } else if ($('#tableexport >tbody >tr').length == 1) {
            alert('Итоговая таблица пуста.');
            return;
        } else if ($('#mt-reportname').val() == '') {
            alert('Укажите имя для отчета.');
            return;
        }

        var html, tmphtml, link, blob, url, css, filename;

        filename = $('#mt-reportname').val();

        css = (
            '<style>' +
            '@page WordSection1{size: 841.95pt 595.35pt;mso-page-orientation: landscape;}' +
            'div.WordSection1 {page: WordSection1;}' +
            'table{border-collapse:collapse;}td{border:1px gray solid;width:5em;padding:2px;text-align:center;}' +
            'h1{text-align:center;}' +
            '</style><h1>' + filename + '</h1>'
        );

        html = window.docx.innerHTML;

        $('#tableexport').find('button').each(function(i, elem) {
            html = html.replace('<button type="button" class="btn btn-danger btn-round btn-disslist" data-diss-id="' + $(this).attr('data-diss-id') + '">X</button>', '');
        });

        blob = new Blob(['\ufeff', css + html], {
            type: 'application/msword'
        });
        url = URL.createObjectURL(blob);
        link = document.createElement('A');
        link.href = url;
        link.download = filename + '.doc';
        document.body.appendChild(link);
        if (navigator.msSaveOrOpenBlob) navigator.msSaveOrOpenBlob(blob, filename + '.doc'); // IE10-11
        else link.click(); // other browsers
        document.body.removeChild(link);
    });

    $('#calcbtnadd').on('click', function() { // Кнопка "Добавить"
        additem();
    });

    $('#mt-type').on('change', function() {
        $('#mt-size').find('option').css('display', 'none');
        $("#mt-size").find('option:selected').removeAttr("selected");
        $('#mt-size').find('option[typename="' + $('#mt-type').val() + '"]').css('display', 'block');
        $("#mt-size").find('option[typename="' + $('#mt-type').val() + '"]:first').attr("selected", "selected");
        $('#mt-qty').val(1);
        Calculate();
    });

    $('#mt-size').on('change', function() {
        Calculate();
        $('#mt-qty').val(1);
    });

    $('#mt-qty').on('input keyup', function() {
        if (!$(this).val()) {
            $(this).addClass('invalidinput')
        } else {
            $(this).removeClass('invalidinput')
        }

        Calculate();
    });

    $('#mt-qty').on('focusout', function() {
        if (!formatinput($(this), 'qty')) {
            $('#cl-qty').text($(this).val());
        }
    });

    $('#mt-percent').on('input keyup', function() {
        if (!$(this).val()) {
            $(this).addClass('invalidinput');
        } else {
            $(this).removeClass('invalidinput');
        }

        recalcpercent();
    });

    $('#mt-mathchar').on('change', function() {
        recalcpercent();
    });

    $('#mt-percent').on('focusout', function() {
        formatinput($(this));
    });

    $('.mt-input').on('keypress', function(e) { // Разрешаем ввод только для перечисленных клавишь
        // 8 = backspace; 46 = delete; 48-57 = Цифры. (Сивол точки разрешен по дефолту)
        if (!(e.which == 8 || e.which == 46 || (e.which > 47 && e.which < 58))) return false;
    });

    $('body').on('click', '.btn-disslist', function() { // Кнопка "Удалить" (красный круг в котором знак минуса справа от каждого элемента в итоговой таблице)
        total_sum -= parseFloat($('.tdcostproduct[data-id="' + $(this).attr('data-diss-id') + '"]').attr('floatVal'));
        total_sum_with_percent = CalcPercent(total_sum);
        var tdtotalsumvalue = parseFloat(total_sum_with_percent).toFixed(2);
        if (tdtotalsumvalue == '-0.00') {
            tdtotalsumvalue = 0;
        }
        var notpercent = '';
        if ($('#mt-percent').val() != 0) {
            notpercent = ' (' + parseFloat(total_sum).toFixed(2) + ' без %)';
        }
        $('#tdtotalsum').replaceWith('<td id="tdtotalsum">' + tdtotalsumvalue + ' руб.' + notpercent + '</td>');
        $('.table-productlist').find('tr[data-id="' + $(this).attr('data-diss-id') + '"]').remove();
        $(this).remove();
        renumberlist();
    });

    Calculate();
});