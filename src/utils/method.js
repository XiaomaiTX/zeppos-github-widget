import { px } from "@zos/utils";
export function generateHeatmapData(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const data = [];

    const currentDate = new Date(start);
    while (currentDate <= end) {
        const level = Math.floor(Math.random() * 5) + 1;

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;

        data.push({
            date: dateStr,
            level: level,
        });

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
}
export function generateHeatmapBoxes(
    githubHeatmapData,
    boxPerRow,
    rows,
    boxSize,
    spacing
) {
    const dataMap = {};
    githubHeatmapData.forEach((item) => {
        if (item.level >= 1 && item.level <= 5) {
            dataMap[item.date] = item.level;
        }
    });
    const endDateStr = githubHeatmapData[githubHeatmapData.length - 1].date;
    const endDate = new Date(endDateStr);
    const endDayOfWeek = endDate.getDay();

    const lastWeekSunday = new Date(endDate);
    lastWeekSunday.setDate(endDate.getDate() - endDayOfWeek);

    const startDate = new Date(lastWeekSunday);
    startDate.setDate(lastWeekSunday.getDate() - (boxPerRow - 1) * 7);

    const boxList = [];
    for (let col = 0; col < boxPerRow; col++) {
        for (let row = 0; row < rows; row++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + col * 7 + row);

            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, "0");

            const day = String(currentDate.getDate()).padStart(2, "0");
            const dateStr = `${year}-${month}-${day}`;

            let level = dataMap[dateStr] || null;

            if (currentDate > endDate) {
                level = null;
            }

            if (currentDate <= endDate && level !== null) {
                boxList.push({
                    x: col * (boxSize + spacing),
                    y: row * (boxSize + spacing),
                    w: px(boxSize),
                    h: px(boxSize),
                    level: level,
                    date: dateStr,
                });
            }
        }
    }
    return boxList;
}
export function genRamdomLevel() {
    return Math.floor(Math.random() * 5) + 1;
}

export function getMonthLabels(heatmapData, boxPerRow, boxSize, spacing) {
    if (!heatmapData || heatmapData.length === 0) return [];
    
    const cellWidth = boxSize + spacing;
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const endDateStr = heatmapData[heatmapData.length - 1].date;
    const endDate = new Date(endDateStr);
    const endDayOfWeek = endDate.getDay();
    
    const lastWeekSunday = new Date(endDate);
    lastWeekSunday.setDate(endDate.getDate() - endDayOfWeek);
    
    const startDate = new Date(lastWeekSunday);
    startDate.setDate(lastWeekSunday.getDate() - (boxPerRow - 1) * 7);
    
    const labels = [];
    const monthsDisplayed = new Set();
    
    for (let col = 0; col < boxPerRow; col++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + col * 7);
        
        if (currentDate > endDate) continue;
        
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const monthYearKey = `${year}-${month}`;
        
        if (currentDate.getDate() <= 7 && !monthsDisplayed.has(monthYearKey)) {
            monthsDisplayed.add(monthYearKey);
            
            const x = col * cellWidth;
            
            labels.push({
                x: px(x),
                text: monthNames[month]
            });
        }
    }
    
    labels.sort((a, b) => a.x - b.x);
    
    const filteredLabels = [];
    let lastX = -Infinity;
    const minDistance = cellWidth * 3;
    
    for (const label of labels) {
        if (label.x - lastX >= minDistance) {
            filteredLabels.push(label);
            lastX = label.x;
        }
    }
    
    if (filteredLabels.length === 0 && labels.length > 0) {
        const lastLabel = labels[labels.length - 1];
        filteredLabels.push(lastLabel);
    }
    
    return filteredLabels;
}

function convertToHeatmapData(githubData) {
  const colorToLevel = {
    '#ebedf0': 1,  // 无贡献
    '#9be9a8': 2,  // 等级1
    '#40c463': 3,  // 等级2
    '#30a14e': 4,  // 等级3
    '#216e39': 5   // 等级4
  };
  
  const darkModeColors = {
    '#161b22': 1,
    '#0e4429': 2,
    '#006d32': 3,
    '#26a641': 4,
    '#39d353': 5
  };
    const colorMap = { ...colorToLevel, ...darkModeColors };
  
  // 提取并转换数据
  const weeks = githubData.user.contributionsCollection.contributionCalendar.weeks;
  
  const result = [];
  
  weeks.forEach(week => {
    week.contributionDays.forEach(day => {
      result.push({
        date: day.date,
        level: colorMap[day.color] || 1 
      });
    });
  });
  
  return result;
}