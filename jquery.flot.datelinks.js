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

This creates a Yahoo Finance like links for timeseries graphs allowing
users to select different time ranges (e.g. max, 1y, 6m, 3m, 1m, 2w, 1w).
*/
(function ($) {
    var options = {
        series: { datelinks: null } // or true
    };
    
    function init(plot) {
		/**
		 * Inject links into the top-left of a graph for different time ranges.
		 *
		 * @param plot - Plot object created by Flot
		 * @param ctx - Canvas context
		 */
		function createLinks(plot, ctx) {
			var opts = plot.getOptions();
			if (opts.xaxis.mode !== 'time' || !opts.series.datelinks) return;

			var xaxis = plot.getAxes().xaxis,
				mintime = xaxis.datamin,
				maxtime = xaxis.datamax,
				timediff = maxtime - mintime,
				dayInMillis = 1000 * 60 * 60 * 24,
				monthInMillis = 30 * dayInMillis;

			// NOTE: must be iterated in sorted order
			// NOTE: this a stupid way to do months, but we'll care about that later
			var timePeriods = { '1w': 7 * dayInMillis, '2w': 14 * dayInMillis,
					'1m': monthInMillis, '3m': 3 * monthInMillis, '6m': 6 * monthInMillis,
					'1y': 12 * monthInMillis };

			var topLeftOffset = plot.pointOffset({ x: xaxis.min, y: plot.getAxes().yaxis.max });
			var fragment = document.createDocumentFragment();
			var wrapper = document.createElement('div');
			wrapper.id = 'date-period-links';
			// TODO: this puts it in the top-left, but there's no reason we can't move this around
			wrapper.style.cssText = 'position:absolute; left:' + (topLeftOffset.left + 5) + 'px; top: 10px;';
			var link = document.createElement('span');
			link.style.cssText = 'color: #00F; text-decoration: underline; font-size: 0.85em; padding-right: 5px; cursor: pointer;';
			link.innerHTML = 'max';
			
			var replot = function(plot, xmin, xmax) {
				// Return an onclick event handler function
				return function(evt) {
					var data = plot.getData();
					// Keep all options except axes limits
					for (var i = 0, len = data.length; i < len; i++) {
						// FIXME: need to set yaxis value differently, cannot find a way to detect it from data object
						// THIS WILL BREAK WHEN TRYING TO USE MULTIPLE DATASETS WITHOUT MULTIPLE Y-AXES!
						var yaxis = i + 1;
						delete data[i].xaxis;
						data[i].yaxis = yaxis;
						delete data[i].datapoints;
					}
					plot = $.plot(plot.getPlaceholder(), data, $.extend(true, {}, opts, {
						xaxis: { min: xmin, max: xmax },
						x2axis: { min: xmin, max: xmax }
					}));
				}
			}
			// Plot with all data
			link.onclick = replot(plot, mintime, maxtime);
			wrapper.appendChild(link);
			
			for (var timePeriod in timePeriods) {
				if (timePeriods.hasOwnProperty(timePeriod)) {
					if (timePeriods[timePeriod] < timediff) {
						// Append link to html fragment
						var linkClone = link.cloneNode(true);
						linkClone.innerHTML = timePeriod;
						linkClone.onclick = replot(plot, maxtime - timePeriods[timePeriod], maxtime);
						wrapper.appendChild(linkClone);
					} else { //No more links with greater time periods will be necessary
						break;
					}
				}
			}

			fragment.appendChild(wrapper);
			plot.getPlaceholder().append(fragment);
		}
		
        plot.hooks.draw.push(createLinks);
    }
    
    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'datelinks',
        version: '0.1'
    });
})(jQuery);
