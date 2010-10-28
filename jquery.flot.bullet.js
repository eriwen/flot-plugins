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

This creates a stacked horizontal bar chart emphasizing a target and an
actual value while showing a green (good), yellow (warning), and red (bad)
ranges. 
*/
(function ($) {
    var options = {
		series: { bullet: null } // or { min: 0, max: 100, target: 90, actual: 75 }
    };
    
    function init(plot) {
		/**
		 * Draw an overlay of a dot over the last point on the given plot.
		 * 
		 * @param plot - Plot object created by Flot
		 * @param ctx - Canvas context
		 */
		function drawAnnotations(plot, ctx) {
			var bulletOpts = plot.getOptions().series.bullet;
			if (!bulletOpts) return;
			
			ctx.fillStyle = "#000";
			var height = plot.height();
			
			// Draw target
			if (bulletOpts.target) {
				var targetOffset = plot.pointOffset({ x: bulletOpts.target, y: 0 });
				ctx.fillRect(targetOffset.left - 1, targetOffset.top - (height / 2), 2, height);
				ctx.beginPath();
				ctx.moveTo(targetOffset.left, targetOffset.top);
				ctx.arc(targetOffset.left, targetOffset.top, 2, 0, Math.PI * 2, true);
				ctx.fill();
				ctx.save();
			}
			
			// Draw actual
			if (bulletOpts.actual) {
				var actualOffset = plot.pointOffset({ x: bulletOpts.actual, y: 0 });
				plot.getPlaceholder().append('<div class="actual"'
				 	+ 'style="position:absolute;left:' + (actualOffset.left + 4) + 'px;top:'
				 	+ (actualOffset.top - (height - 4) * 2) + 'px;">'+bulletOpts.actual+'</div>');
				ctx.fillRect(actualOffset.left - 1, actualOffset.top - (height / 1.5), 2, height * 1.5);
				ctx.save();
			}
		}
		
		function overrideYCoords(plot, s, datapoints) {
			if(!plot.getOptions().series.bullet) return;
			datapoints.points[1] = 0;
		}
		
		function overrideOptionsForBullet(plot) {
			var options = plot.getOptions();
			var series = options.series;
			if (!series.bullet) return;
			
			series.lines.show = false;
			series.points.show = false;
			
			var grid = options.grid;
			grid.show = true;
			grid.borderWidth = 0;
			
			var bars = series.bars;			
			bars.show = true;
			bars.align = 'center';
			bars.lineWidth = 6;
			bars.horizontal = true;
			
			var xaxis = options.xaxis;
			xaxis.min = series.bullet.min || 0;
			xaxis.max = series.bullet.max || 100;
			xaxis.ticks = [xaxis.min, (xaxis.min + xaxis.max) / 2, xaxis.max];
			
			var yaxis = options.yaxis;
			yaxis.min = -2;
			yaxis.max = 2;
			yaxis.ticks = 0;
			
			options.colors = ['#0C0', '#FFD200', '#C00', '#FFD200', '#0C0'];
		}
		
		plot.hooks.processOptions.push(overrideOptionsForBullet);
		plot.hooks.processDatapoints.push(overrideYCoords);
        plot.hooks.draw.push(drawAnnotations);
    }
    
    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'bullet',
        version: '1.0'
    });
})(jQuery);
