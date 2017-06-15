$(function() {
    $('#douban').blur(function() {
        var douban = $(this)
        var id = douban.val()

        if (id) {
            $.ajax({
                url: 'https://api.douban.com/v2/movie/' + id,
                cache: true,
                type: 'get',
                dataType: 'jsonp',
                crossDomain: true,
                jsonp: 'callback',
                success: function(data) {
                    $('#inputTitle').val(data.title)
                    $('#inputDirecter').val(data.author[0].name)
                    $('#inputCountry').val(data.attrs.country)
                    $('#inputLanguage').val(data.attrs.language)
                    $('#inputPoster').val(data.image)
                    $('#inputYear').val(data.attrs.year)
                    $('#inputSummary').val(data.summary)
                }
            })
        }
    })
})