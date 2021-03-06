$(document).ready(function(){

	$('input#article_title_input').editable({
		'placeholder' : '제목 입력',
		'font-size' : '49px',
		'line-height' : '49px',
		'font-family' : 'Nanum Barun Gothic',
		'text-position' : {
			'top' : -3
		},
	});

	$('input#article_subtitle_input').editable({
		'placeholder' : '부제목 입력',
		'font-size' : '21px',
		'line-height' : '21px',
		'font-family' : 'Nanum Barun Gothic',
		'text-position' : {
			'top' : -3
		},
	});

	$('input#location_input').editable({
		'placeholder' : '장소 입력',
		'font-size' : '25px',
		'line-height' : '25px',
		'font-family' : 'Nanum Barun Gothic',
		'text-position' : {
			'top' : 3
		},
	});

	$('input#host_name_input').editable({
		'placeholder' : '주체 단체 명',
		'font-size' : '25px',
		'line-height' : '25px',
		'font-family' : 'Nanum Barun Gothic',
		'text-position' : {
			'top' : 3
		},
	});

	$('textarea#host_content_textarea').editable({
		'placeholder' : '주체 단체 설명',
		'line-height' : '68px',
	});

	$('textarea#notice_content_textarea').editable({
		'placeholder' : '공지사항 입력',
		'line-height' : '68px',
		'color' : '#beb7b7',
	});

	$.each($('#timeslot_table tr'), function(i, v){
		var $this = $(this);
		var timeslotID = $this.attr('timeslot-id');
		var removeIcon = $(this).find('.timeslot-remove');
		removeIcon.click(function(e) {
			$this.remove();
		});
	});

	$('#timeslot_add_container').click(function(e){
		var ele = $('#timeslot_add_form');
		var $this = $(this);
		var position = $this.position();
		ele.css({
			'top' : position.top + 40,
			'left' : position.left - 300,
		});
		ele.toggle();
	});

	$('#timeslot_add_button').click(function(e){
		e.preventDefault();
		var data = getNewTimeSlot();
		var stime = data.start_time;

		var tr = $('<tr></tr>').attr('mode', 'new');
		var removeTD = $('<td></td>').addClass('timeslot-remove');
		removeTD.append($('<div></div>').addClass('timeslot-remove-icon'));
		var dateTD = $('<td>' + (stime.getMonth() + 1) + '월 ' +
							stime.getDate() + '일 ' + stime.getHours() + '시 ' +
							stime.getMinutes() + '분</td>')
					.addClass('timeslot-time')
					.attr({
						'time-year' : stime.getFullYear(),
						'time-month' : stime.getMonth() + 1,
						'time-date' : stime.getDate(),
						'time-hour' : stime.getHours(),
						'time-minute' : stime.getMinutes(),
					});
		var labelTD = $('<td></td>');
		labelTD.append('<button class="timeslot-label">' + data.label + '</button>');;

		tr.append(removeTD).append(dateTD).append(labelTD);
		$('#timeslot_table tbody').append(tr);

		removeTD.click(function (e){
			tr.remove();
		});

		$('#timeslot_add_form').toggle();
		$('#timeslot_add_form input').val('');
	});

	var getNewTimeSlot = function() {
		// TODO validation
		var newDate = new Date();
		newDate.setFullYear($('#ts_year').val());
		newDate.setMonth($('#ts_month').val() - 1);
		newDate.setDate($('#ts_date').val());
		newDate.setHours($('#ts_hour').val());
		newDate.setMinutes($('#ts_minute').val());

		return {
			'label' : $('#ts_label').val(),
			'start_time' : newDate,
			'type' : 'point',
		};
	};

	var timeslotTable = $('#timeslot_table').datawrapper({
		'trigger' : ['DOMSubtreeModified'],
		'getData': function() {
			var data = [];
			$.each(this.element.find('tr'), function(i, _tr){
				var tr = $(_tr);
				var timeslot = { };
				var mode = tr.attr('mode');
				if (mode == 'old'){
					timeslot['id'] = tr.attr('timeslot-id');
				} else {
					var label = tr.find('.timeslot-label').text();
					var timeTD = tr.find('.timeslot-time');
					var time = timeTD.attr('time-year') + '-' + timeTD.attr('time-month') +
							'-' + timeTD.attr('time-date') + 'T' + timeTD.attr('time-hour') +
							':' + timeTD.attr('time-minute') + 'Z';
					timeslot['label'] =  label;
					timeslot['start_time'] = time;
					timeslot['type'] = 'point';
				}
				data.push(timeslot);
			});
			return {
				'field' : 'timeslot',
				'value' : JSON.stringify(data),
			};
		},
	}).data('datawrapper');

	$('#article_image_input').change(function() {
		if (this.files && this.files[0]) {
			var reader = new FileReader();
			reader.onload = function (e) {
				var newImage = $(document.createElement('img')).attr({
					'src' : e.target.result,
				}).hide();
				var toAppend = $('#article_image div.editable-img');
				toAppend.empty().append(newImage);
				newImage.fadeIn('slow');
			}
			reader.readAsDataURL(this.files[0]);
		}
	});

	$('#host_image_input').change(function() {
		if (this.files && this.files[0]) {
			var reader = new FileReader();
			reader.onload = function (e) {
				var newImage = $('<img></img>').attr({
					'src' : e.target.result,
					'id' : 'host_image',
				}).hide();
				var toPrepend = $('#host_head_container');
				var oldImage = $('img#host_image');
				oldImage.remove();
				toPrepend.prepend(newImage);
				newImage.fadeIn('slow');
			}
			reader.readAsDataURL(this.files[0]);
		}
	});

	$('#edit_button').click(function(e){
		e.preventDefault();
		if (!update()) {
			update(true);
		}
	});

	var titleInput = $("#article_title_input").datawrapper({
		'getData' : function() {
			return {
				'field' : 'title',
				'value' : this.element.val().trim(),
			};
		},
		'setData' : function(data) {
			this.element.val(data['title']);
		},
	}).data('datawrapper');

	var subtitleInput = $("#article_subtitle_input").datawrapper({
		'getData' : function() {
			return {
				'field' : 'subtitle',
				'value' : this.element.val().trim(),
			};
		},
		'setData' : function(data) {
			this.element.val(data['subtitle']);
		},
	}).data('datawrapper');

	var articleImageInput = $('#article_image_input').datawrapper({
		'trigger' : ['change'],
		'getData' : function() {
			var realInput = this.element[0];
			if (realInput.files && realInput.files[0]){
				return {
					'field' : 'image',
					'value' : realInput.files[0],
				};
			} else {
				return null;
			}
		},
	}).data('datawrapper');

	var hostImageInput = $('#host_image_input').datawrapper({
		'trigger' : ['change'],
		'getData' : function() {
			var realInput = this.element[0];
			if (realInput.files && realInput.files[0]){
				return {
					'field' : 'image',
					'value' : realInput.files[0],
				};
			} else {
				return null;
			}
		},
	}).data('datawrapper');

	var articleContent = $("#article_content").datawrapper({
		'getData' : function () {
			return {
				'field' : 'content',
				'value' : this.element.cleanHtml(),
			};
		},
		'setData' : function (data) {
			this.element.html(data.content);
		},
	}).data('datawrapper');

	var locationInput = $("#location_input").datawrapper({
		'getData' : function() {
			return {
				'field' : 'location',
				'value' : this.element.val(),
			}
		},
		'setData' : function(data) {
			this.element.val(data['location']);
		},
	}).data('datawrapper');

	var hostnameInput = $("#host_name_input").datawrapper({
		'getData' : function() {
			return {
				'field' : 'host_name',
				'value' : this.element.val(),
			};
		},
		'setData' : function(data) {
			this.element.val(data['host']['name']);
		},
	}).data('datawrapper');

	var hostdescTextarea = $("#host_content_textarea").datawrapper({
		'getData' : function() {
			return {
				'field' : 'host_description',
				'value' : this.element.val(),
			};
		},
		'setData' : function(data) {
			this.element.val(data['host']['description']);
		},
	}).data('datawrapper');

	var noticeTextarea = $("#notice_content_textarea").datawrapper({
		'getData' : function() {
			return {
				'field' : 'announcement',
				'value' : this.element.val().trim(),
			};
		},
		'setData' : function(data) {
			this.element.val(data['announcement']);
		},
	}).data('datawrapper');

	var checkList = [
				titleInput,
				subtitleInput,
				timeslotTable,
				articleImageInput,
				articleContent,
				locationInput,
				hostImageInput,
				hostnameInput,
				hostdescTextarea,
				noticeTextarea,
			];

	var update = function (forced) {
		var _forced = forced || false;

		var formData = new FormData();
		var fieldsData = [];

		$.each(checkList, function (i, d) {
			if (_forced || d.isChanged()){
				var dict = d.getData();
				if (dict) {
					fieldsData.push(dict['field']);
					formData.append(dict['field'], dict['value']);
				}
			}
		});

		if (!_forced && fieldsData.length == 0){
			return false;
		}

		formData.append('fields', fieldsData);

		$.ajax({
			'type' : 'POST',
			'url' : document.URL,
			'data' : formData,
			'dataType' : 'json',
			'contentType' : false,
			'processData' : false,
			'success' : function (data, textStatus, jqXHR) {
				$.each(checkList, function (i, d) {
					d.reset();
					d.setData(data['article']);
				});
				var dd = new Date(data['article']['updated_date']);
				$("#update_news").text((dd.getMonth() + 1) + '월 ' + dd.getDate() + '일 ' + 
					dd.getHours() + '시 ' + dd.getMinutes() + '분 ' + dd.getSeconds() + '초');
			},
			'error' : function(req, textStatus, err) {
				console.log(textStatus);
			},
		});

		return true;
	};
});
