# What is Flot? #
Flot is a pure Javascript plotting library for jQuery. It produces graphical plots of arbitrary datasets on-the-fly client-side. Learn more at on the [Flot project home page](http://code.google.com/p/flot/).

# How do I use these plugins? #
Just include jQuery, and flot, and plugin JS files on your page, and use it as a normal Flot plugin:
    
    <script language='javascript' type='text/javascript' src='jquery-1.4.2-min.js'></script> 
    <script language='javascript' type='text/javascript' src='jquery.flot.js'></script>
    <script language='javascript' type='text/javascript' src='jquery.flot.sparkline.js'></script>
    <script type="text/javascript">
        // ... your code ...

		var placeholder = $('#sparkline-ph');
		var plot = $.plot(placeholder, [{
			data: [[1285614437984, 7], [1285614537984, 50], [1285614637984, 17]],
			color: "#6699FF"
		}], {
			xaxis: { mode: 'time' },
			yaxis: { min: 0, max: 100 },
			series: { sparkline: true }
		});

        // ... more code of yours ...
    </script>
