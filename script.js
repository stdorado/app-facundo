document.addEventListener('DOMContentLoaded', function () {
    const playersTable = document.getElementById('players-table');
    const timerDisplay = document.getElementById('timer');
    const controlsDiv = document.querySelector('.controls');
    const matchDateInput = document.getElementById('match-date');
    const rivalNameInput = document.getElementById('rival-name');
    const matchDateDisplay = document.getElementById('match-date-display');
    const rivalNameDisplay = document.getElementById('rival-name-display');
    let minutesLeft = 0;
    let secondsLeft = 0;
    let timerInterval = null;
    let timerRunning = false;

    function updateMatchInfo() {
        const matchDate = matchDateInput.value;
        const rivalName = rivalNameInput.value;

        matchDateDisplay.textContent = matchDate;
        rivalNameDisplay.textContent = rivalName;
    }

    matchDateInput.addEventListener('input', updateMatchInfo);
    rivalNameInput.addEventListener('input', updateMatchInfo);

    updateMatchInfo();

    function startTimer() {
        if (!timerRunning) {
            timerInterval = setInterval(updateTimer, 1000);
            timerRunning = true;
        }
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        timerRunning = false;
    }

    function resetTimer() {
        stopTimer();
        minutesLeft = 0;
        secondsLeft = 0;
        updateTimerDisplay();
    }

    function updateTimer() {
        secondsLeft++;
        if (secondsLeft === 60) {
            secondsLeft = 0;
            minutesLeft++;
        }
        updateTimerDisplay();
    }

    function updateTimerDisplay() {
        let minutesDisplay = minutesLeft < 10 ? `0${minutesLeft}` : `${minutesLeft}`;
        let secondsDisplay = secondsLeft < 10 ? `0${secondsLeft}` : `${secondsLeft}`;
        timerDisplay.textContent = `${minutesDisplay}:${secondsDisplay}`;
    }

    function addPlayerRow(numero, nombre) {
        const newRow = playersTable.insertRow();
        newRow.innerHTML = `
            <td contenteditable="true">${numero}</td>
            <td contenteditable="true">${nombre}</td>
            <td contenteditable="true" class="ing-sal"></td>
            <td contenteditable="true" class="goles"></td>
            <td contenteditable="true" class="asistencias"></td>
            <td contenteditable="true" class="perdidas"></td>
            <td contenteditable="true" class="rebotes"></td>
            <td contenteditable="true" class="faltas"></td>
            <td contenteditable="true" class="minutos"></td>
            <td contenteditable="true" class="tarjetas-amarillas"></td>
            <td contenteditable="true" class="tarjetas-rojas"></td>
        `;

        // Añadir eventos de clic a las celdas
        newRow.querySelector('.ing-sal').addEventListener('click', function () {
            let currentValue = this.getAttribute('data-state') || 'Out';
            currentValue = currentValue === 'Out' ? `In (${timerDisplay.textContent})` : `Out (${timerDisplay.textContent})`;
            this.setAttribute('data-state', currentValue);
            this.textContent = currentValue;
        });

        newRow.querySelector('.tarjetas-amarillas').addEventListener('click', function () {
            let currentValue = parseInt(this.getAttribute('data-value')) || 0;
            currentValue++;
            this.setAttribute('data-value', currentValue);
            this.textContent = `${currentValue} (${timerDisplay.textContent}) `;
        });

        newRow.querySelector('.tarjetas-rojas').addEventListener('click', function () {
            let currentValue = parseInt(this.getAttribute('data-value')) || 0;
            currentValue++;
            this.setAttribute('data-value', currentValue);
            this.textContent = `${currentValue} (${timerDisplay.textContent}) `;
        });

        newRow.querySelector('.goles').addEventListener('click', function () {
            let currentValue = parseInt(this.getAttribute('data-value')) || 0;
            currentValue++;
            this.setAttribute('data-value', currentValue);
            this.textContent = `${currentValue} (${timerDisplay.textContent})`;
        });

        newRow.querySelector('.asistencias').addEventListener('click', function () {
            let currentValue = parseInt(this.getAttribute('data-value')) || 0;
            currentValue++;
            this.setAttribute('data-value', currentValue);
            this.textContent = `${currentValue}`;
        });

        newRow.querySelector('.perdidas').addEventListener('click', function () {
            let currentValue = parseInt(this.getAttribute('data-value')) || 0;
            currentValue++;
            this.setAttribute('data-value', currentValue);
            this.textContent = `${currentValue}`;
        });

        newRow.querySelector('.rebotes').addEventListener('click', function () {
            let currentValue = parseInt(this.getAttribute('data-value')) || 0;
            currentValue++;
            this.setAttribute('data-value', currentValue);
            this.textContent = `${currentValue}`;
        });

        newRow.querySelector('.faltas').addEventListener('click', function () {
            let currentValue = parseInt(this.getAttribute('data-value')) || 0;
            currentValue++;
            this.setAttribute('data-value', currentValue);
            this.textContent = `${currentValue}`;
        });

        newRow.querySelector('.minutos').addEventListener('click', function () {
            let currentValue = parseInt(this.getAttribute('data-value')) || 0;
            currentValue++;
            this.setAttribute('data-value', currentValue);
            this.textContent = `${currentValue}`;
        });
    }

    for (let i = 1; i <= 23; i++) {
        addPlayerRow('', '');
    }

    function createButtons() {
        const buttonNames = ['Iniciar', 'Reiniciar', 'Segundo Tiempo', 'Tiempo Extra', 'Descargar Planilla'];
        const buttonFunctions = [startTimer, resetTimer, startSecondHalf, startExtraTime, downloadPDF];

        buttonNames.forEach((name, index) => {
            const button = document.createElement('button');
            button.textContent = name;
            button.classList.add('control-btn');
            button.addEventListener('click', buttonFunctions[index]);
            controlsDiv.appendChild(button);
        });
    }

    function startSecondHalf() {
        minutesLeft = 45;
        secondsLeft = 0;
        updateTimerDisplay();
        startTimer();
    }

    function startExtraTime() {
        startTimer();
    }

    createButtons();
    updateTimerDisplay();
});

async function downloadPDF() {
    const { PDFDocument, rgb, StandardFonts } = PDFLib;
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // Tamaño A4 en puntos (210x297 mm)
    const { width, height } = page.getSize();

    // Obtener datos del partido
    const season = document.getElementById('season').value;
    const round = document.getElementById('round').value;
    const category = document.getElementById('category').value;
    const matchDate = document.getElementById('match-date').value;
    const rivalName = document.getElementById('rival-name').value;

    // Usar una fuente incrustada alternativa
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    // Configuración para el texto
    const textConfig = {
        size: 10, // Tamaño del texto
        font,
        color: rgb(0, 0, 0)
    };

    // Configuración de la tabla
    const tableWidth = 500;
    const cellPadding = 8; // Padding aumentado
    const rowHeight = 25; // Altura de las celdas aumentada
    const headerHeight = rowHeight * 2; // Doble altura para encabezado y valores
    let x = (width - tableWidth) / 2;
    let y = height - 50; // Posición vertical inicial

    // Encabezados y valores
    const headers = ['Temporada', 'Jornada', 'Categoría', 'Fecha del Partido', 'Equipos que jugaron'];
    const values = [season, round, category, matchDate, `${rivalName}`];

    // Dibujar encabezados de columna
    headers.forEach((header, index) => {
        // Dibujar la caja de la celda
        page.drawRectangle({
            x,
            y,
            width: tableWidth / headers.length,
            height: headerHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
            color: rgb(0.9, 0.9, 0.9) // Color de fondo gris claro
        });

        // Dibujar el texto del encabezado
        page.drawText(header, {
            x: x + cellPadding,
            y: y + headerHeight - cellPadding - (headerHeight / 2 - textConfig.size / 2),
            size: textConfig.size,
            font: textConfig.font,
            color: textConfig.color,
            maxWidth: tableWidth / headers.length - 2 * cellPadding // Limitar ancho del texto
        });

        x += tableWidth / headers.length;
    });

    y -= headerHeight; // Mover hacia abajo para la fila de valores

    // Dibujar valores de columna
    x = (width - tableWidth) / 2;
    values.forEach((value, index) => {
        // Dibujar la caja de la celda
        page.drawRectangle({
            x,
            y,
            width: tableWidth / headers.length,
            height: rowHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1
        });

        // Dibujar el texto del valor
        page.drawText(value, {
            x: x + cellPadding,
            y: y + rowHeight - cellPadding - (rowHeight / 2 - textConfig.size / 2),
            size: textConfig.size,
            font: textConfig.font,
            color: textConfig.color,
            maxWidth: tableWidth / headers.length - 2 * cellPadding // Limitar ancho del texto
        });

        x += tableWidth / headers.length;
    });

    y -= rowHeight + 20; // Espacio entre encabezado y tabla de jugadores

    // Obtener datos de la tabla de jugadores
    const table = document.getElementById('players-table');
    const rows = table.rows;

    // Obtener encabezados de la tabla de jugadores
    const playerHeaders = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
    const headerCellWidth = tableWidth / playerHeaders.length;

    // Dibujar encabezados de columna de jugadores
    x = (width - tableWidth) / 2;
    page.drawRectangle({
        x,
        y,
        width: tableWidth,
        height: rowHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
        color: rgb(0.9, 0.9, 0.9) // Color de fondo gris claro
    });

    playerHeaders.forEach(header => {
        page.drawRectangle({
            x,
            y,
            width: headerCellWidth,
            height: rowHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
            color: rgb(0.9, 0.9, 0.9) // Color de fondo gris claro
        });
        page.drawText(header, {
            x: x + cellPadding,
            y: y + rowHeight - cellPadding - (rowHeight / 2 - textConfig.size / 2),
            size: 10, // Tamaño del texto para encabezados de jugadores
            font
        });
        x += headerCellWidth;
    });

    y -= rowHeight;

    // Dibujar filas de la tabla de jugadores
    Array.from(rows).forEach((row, rowIndex) => {
        if (rowIndex === 0) return; // Saltar encabezado

        const cells = Array.from(row.cells);
        x = (width - tableWidth) / 2;

        cells.forEach((cell, cellIndex) => {
            const text = cell.textContent.trim();
            const cellWidth = tableWidth / cells.length;

            // Dibujar celda
            page.drawRectangle({
                x,
                y,
                width: cellWidth,
                height: rowHeight,
                borderColor: rgb(0, 0, 0),
                borderWidth: 1
            });

            // Dibujar texto centrado verticalmente
            page.drawText(text, {
                x: x + cellPadding,
                y: y + rowHeight - cellPadding - (rowHeight / 2 - textConfig.size / 2),
                size: 10, // Tamaño del texto para celdas de jugadores
                font
            });

            x += cellWidth;
        });

        y -= rowHeight;
    });

    // Guardar el PDF y descargar
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `planilla_${rivalName.replace(/\s+/g, '_')}_${matchDate}.pdf`;
    link.click();

    URL.revokeObjectURL(blobUrl);
}








