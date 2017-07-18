
var matched, browser;

jQuery.uaMatch = function( ua ) {
    ua = ua.toLowerCase();

    var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
        /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
        /(msie)[\s?]([\w.]+)/.exec( ua ) ||       
        /(trident)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
        [];

    return {
        browser: match[ 1 ] || "",
        version: match[ 2 ] || "0"
    };
};

matched = jQuery.uaMatch( navigator.userAgent );
//IE 11+ fix (Trident) 
matched.browser = matched.browser == 'trident' ? 'msie' : matched.browser;
browser = {};

if ( matched.browser ) {
    browser[ matched.browser ] = true;
    browser.version = matched.version;
}

// Chrome is Webkit, but Webkit is also Safari.
if ( browser.chrome ) {
    browser.webkit = true;
} else if ( browser.webkit ) {
    browser.safari = true;
}

if ( browser.mozilla ) {
    $('table').removeClass('fixed')
}

jQuery.browser = browser;
// log removed - adds an extra dependency
//log(jQuery.browser)



function updatecols(){
    
    l = document.getElementById('table1').rows[1].cells.length
    for(i = 2; i < l+1; i++){
        $('td:nth-child('+ i +'),th:nth-child('+ i +')').show()
        if($('td:nth-child('+ i +'):contains("✓"):visible,td:nth-child('+ i +'):contains("☑"):visible').length == 0) {
            $('td:nth-child('+ i +'),th:nth-child('+ i +')').hide()
        }
    }
    updatewidth();
}

function updaterows(){
    
    $('tbody>tr').each(function() {
        var row = $(this)[0]
        if($(this).children().filter(':contains("✓"):visible,:contains("☑"):visible').length == 0){
            $(this).hide()
        }
    })
    updatewidth();
}
function updatewidth(){
    var cellwidth = 70
    var width = $('tr:not(.category)>th:visible').length
    $('table.table').css('width', 300+(width-1)*cellwidth+'px')
}
var shifted = false;
var ctrl = false;
var ctrlcollist = []
var ctrllistrow = []
$(document).keydown(function(e){
    shifted = e.shiftKey;
    if(!ctrl && e.ctrlKey){
        ctrl = e.ctrlKey;
        ctrlcollist = [];
        ctrllistrow = [];
        console.log("yo");
    }

} );



$(document).keyup(function(e){
    
    var col;
    if(ctrl && ctrlcollist.length){
        $('td:not(.first-col,.select-col),th:not(.first-col,.select-col)').hide();
        for(col in ctrlcollist){
            $('td:nth-child('+ ctrlcollist[col] +'),th:nth-child('+ ctrlcollist[col] +')').show();
        }
        ctrlcollist = []

        updatewidth()
        updaterows()
        $('th.first-col').attr('colspan',0)
    }
    

    if(ctrl && ctrllistrow.length){
        $('tbody>tr').hide()
        $('tr.category').hide()
        $('th.first-col').attr('colspan',0)
        for(row in ctrllistrow){
            $('#'+ctrllistrow[row]).show()
        }
        $('tr.category').hide()
        ctrllistrow = []
        updatecols()
        updatewidth()
    }
    ctrl = false;
    shifted = false;
})

var myTransition = ($.browser.webkit)  ? '-webkit-transition' :
           ($.browser.mozilla) ? '-moz-transition' : 
           ($.browser.msie)    ? '-ms-transition' :
           ($.browser.opera)   ? '-o-transition' : 'transition';
function centrecolumn(){
    var id = $(this).attr('id')
    //showall()
    if(ctrl){
        ctrlcollist.push(id)
        $('td:nth-child('+ id +')').addClass('highlight')
    } else {
        if(!shifted) {
            $('td:not(#'+id+',.first-col,.select-col),th:not(#'+id+',.first-col,.select-col)').hide();
            $('#info>h4').text($('tr:not(.category)>th:nth-child('+ id +')').text())
            $('#info>p').text($('tr:not(.category)>th:nth-child('+ id +')').attr('data-info'))
            $('th:nth-child('+ id +')').text()
            //$('td:not(nth-child('+ id +')),th:not(nth-child('+ id +'))').hide();
        } else {
            $('td:nth-child('+ id +'),th:nth-child('+ id +')').hide();
        }
        $('th.first-col').attr('colspan',0)
        $('tr.category').hide()
        updaterows()
    }
    
};

function highlightcolumn (){
    //$('td,th').css({'background-color':'#ffffff', myTransition:'background-color .4s'})
    var id = $(this).attr('id')
    $('td:nth-child('+ id +')').addClass('highlight')
    $('th:nth-child('+ id +')').addClass('highlight')
};
function highlightrow (){
    var test = $(this)
    $(this).parent().addClass('highlight')
    //$(this).parent().children('.first-col').addClass('active-title')
};
function resetcolors (){
    $('td,th,tr').removeClass('highlight highlight-title');
    for(col in ctrlcollist){
        $('td:nth-child('+ ctrlcollist[col] +')').addClass('highlight')
    }
    for(row in ctrllistrow){
        $('#'+ctrllistrow[row]).addClass('highlight')
    }
};

l = document.getElementById('table1').rows[1].cells.length;
for(i = 1; i < l+1; i++){
    $('thead>tr:not(.category)>th:nth-child('+ i +')').attr("id",i)
    $('td:nth-child('+ i +')').attr("id",i)
};  

function hideotherrows(){
    var id = $(this).uniqueId().attr('id')
    if(ctrl){
        ctrllistrow.push(id)
        $(this).addClass('highlight')
    } else {
        $('tbody>tr').hide()
        $('th.first-col').attr('colspan',0)
        $('#info>h4').text($('#'+id+'>td.first-col').text())
        $('#info>p').text($('#'+id+'>td.first-col').attr('data-info'))
        $(this).show()
        updatecols()
        $('tr.category').hide()
    }
}

function showall(){
    $('tbody>tr,td').show()
    $('tr.category').show()

    $('th.first-col').attr('colspan',2)
    $('.no-result').hide();
    $('.search').val("");
    updatecols()
    $(".search").val('');
    $('.counter').text('')
    $('#info>h4').text('')
    $('#info>p').text('')
    $('tbody>tr').attr('display','')
}

function selectcategory(){
    if(ctrl){
        var next = $(this).closest('tr').next('tr')
        var num = $(this).find('>td').attr('rowspan')
        for(i = 1; i < num; i++){
            var id = next.uniqueId().attr('id')
            ctrllistrow.push(id)
            next.addClass('highlight')
            next = next.closest('tr').next('tr')
        }
    } else {
        $('tbody>tr').hide()
        $(this).show()
        var next = $(this).closest('tr').next('tr')
        var num = $(this).find('>td').attr('rowspan')
        $('#info>h4').text($(this).find('>td').text())
        $('#info>p').text($(this).find('>td').attr('data-info'))
        for(i = 1; i < num; i++){
            next.show()
            next = next.closest('tr').next('tr')
        }
        updatecols()
        $('tr.category').hide()
    }
}

function highlightcategory(){
    $(this).addClass('highlight')
    var next = $(this).closest('tr').next('tr')
    var num = $(this).find('>td').attr('rowspan')
    for(i = 1; i < num; i++){
        next.addClass('highlight')
        next = next.closest('tr').next('tr')
    }
    //updatecols()
}

function highlightcolcategory(){
    switch ($(this).attr('id')) {
        case 'AA':
            for (i = 3; i <= 6; i++){
                $('td:nth-child('+ i +')').addClass('highlight')
                $('tr:not(.category)>th:nth-child('+ i +')').addClass('highlight')
            }
            break;
        case 'Verian':
            for (i = 8; i <= 10; i++){
                $('td:nth-child('+ i +')').addClass('highlight')
                $('tr:not(.category)>th:nth-child('+ i +')').addClass('highlight')
            }
    }
}

function centrecategory(){
    switch ($(this).attr('id')) {
        case 'AA':
            $('td:not(.first-col,.select-col),th:not(.first-col,.select-col)').hide();
            for (i = 3; i <= 6; i++){
                $('td:nth-child('+ i +')').show()
                $('tr:not(.category)>th:nth-child('+ i +')').show()
            }
            $(this).show()
            break;
        case 'Verian':
            $('td:not(.first-col,.select-col),th:not(.first-col,.select-col)').hide();
            for (i = 8; i <= 10; i++){
                $('td:nth-child('+ i +')').show()
                $('tr:not(.category)>th:nth-child('+ i +')').show() 
            }
            $(this).show()
    }
    $('th.first-col').attr('colspan',1)
    updaterows()
    
};


$('thead>tr.category>th[id]').hover(highlightcolcategory,resetcolors)
$('thead>tr.category>th[id]').click(centrecategory)
$('tr.select-col').hover(highlightcategory,resetcolors)
$('tr:not(.select-col):not(.category)>th').hover(highlightcolumn,resetcolors)
$('tr:not(.select-col)>td').hover(highlightrow,resetcolors)
$('tbody>tr:not(.select-col)').click(hideotherrows)
$('tbody>tr.select-col').click(selectcategory)
$('thead>tr:not(.category)>th.first-col').click(showall)
$('tr:not(.select-col):not(.category)>th:not(.first-col)').click(centrecolumn)


/* 

Search function

*/

$(document).ready(function() {
  $(".search").keyup(function () {
    var searchTerm = $(".search").val();

    var listItem = $('.results tbody').children('tr');
    var searchSplit = searchTerm.replace(/ /g, "'):containsi('")

    $.extend($.expr[':'], {'containsi': function(elem, i, match, array){
        return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
    }
    });

    $(".results tbody tr:not(.select-col)").not(":containsi('" + searchSplit + "')").each(function(e){
        $(this).hide()
    });

    $(".results tbody tr:not(.select-col):containsi('" + searchSplit + "')").each(function(e){
        $(this).show()
    });

    var jobCount = $('.results tbody tr').not(function() {return this.style['display'] == 'none';}).length
    if(jobCount < '34'){
        $('.counter').text(jobCount + (jobCount != 1 ? ' items' : ' item' ));
    } else {
        $('.counter').text('')
    }

    if(jobCount == '0') {$('.no-result').show();$('th.first-col').hide();}
    else {$('.no-result').hide();$('th.first-col').show()}
    updatecols()
    if(searchTerm){
        $('tbody>tr.select-col').hide()
        $('th.first-col').attr('colspan',0)
    } else {
        $('tbody>tr.select-col').show()
        $('th.first-col').attr('colspan',2)
        showall()
    }
});
$(".search").keydown(function () {
    if(!$(".search").val()){
        showall();
        $('.no-result').hide();
    }
});
});