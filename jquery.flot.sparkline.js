/*
  Copyright 2010 Return Path, Inc
      http://www.returnpath.net.net/

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

This creates a Google Chart API inspired spark line chart, along with
emphasizing and annotating the last point on the chart.
*/
(function ($) {
    var options = {
        series: { sparkline: null } // or true or {lastPoint: true}
    };
    
    function init(plot) {
		/**
		 * Given JSON series in the form: {color: '#69F', data: [[x1, y1], [x2, y2], ..] ..}, return the X/Y point with
		 * the greatest value.
		 * 
		 * @param data - <Array<Array<Number, Number>>>
		 * @return <Array<Number, Number>> X,Y point with greatest X value
		 */
		function getLastPoint(series) {
			var max = Number.NEGATIVE_INFINITY;
			for (var i = 0, len = series.length; i < len; i++) {
				var j = series[i].data.length;
				var data = series[i].data;
				while (j--) {
					if (data[j] && data[j].constructor == Array && data[j][0] > max) {
						max = data[j];	
					}
				}				
			}
			return max;
		}
		
		/**
		 * Draw an overlay of a dot over the last point on the given plot.
		 * 
		 * @param plot - Plot object created by Flot
		 * @param ctx - Canvas context
		 */
		function emphasizeLastPoint(plot, ctx) {
			var sparklineOpts = plot.getOptions().series.sparkline;
			if (!sparklineOpts || !sparklineOpts.lastPoint) return;
			var lastPoint = getLastPoint(plot.getData());
			
			var lastPointOffset = plot.pointOffset({ x: lastPoint[0], y: lastPoint[1] });
			plot.getPlaceholder().append('<div class="spark-annotation"'
				+ 'style="position:absolute;left:' + (lastPointOffset.left - 9) + 'px;top:' + (lastPointOffset.top - 20) + 'px;"'
				+ '>'+lastPoint[1]+'</div>');
			ctx.beginPath();
			ctx.moveTo(lastPointOffset.left, lastPointOffset.top);
			ctx.arc(lastPointOffset.left - 2, lastPointOffset.top + 1, 2, 0, Math.PI * 2, true);
			ctx.fillStyle = "#000";
			ctx.fill();
			ctx.save();
		}
		
		/**
		 * Enforce options to be used for sparkline chart.
		 *
		 * @param plot object
		 */
		function overrideOptionsForSparkline(plot) {
			var options = plot.getOptions();
			var series = options.series;
			if (!series.sparkline) return;
			
			options.grid.show = false;
			series.lines.show = true;
			series.bars.show = false;
			series.points.show = false;
		}
		
		plot.hooks.processOptions.push(overrideOptionsForSparkline);
        plot.hooks.draw.push(emphasizeLastPoint);
    }
    
    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'sparkline',
        version: '1.1'
    });
})(jQuery);
