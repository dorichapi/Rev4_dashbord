// ✅ Google Apps ScriptのURLをここに貼り付け
const apiUrl = "https://script.google.com/macros/s/AKfycbzFNOekouxWlJ3g_q6Fg3ZXTX8udctKQSBKAwkupswvDaT5GJAF2dc2t1mDMdT2jA9q/exec";

// ✅ 理事長のことば・経営戦略室の戦略のスプレッドシートURL
const presidentSheetUrl = "https://docs.google.com/spreadsheets/d/1Ka4nZ1hoKhPIbZf8IdAuErfhEfGMnyi6EzEYMalJNkM/gviz/tq?tqx=out:json&gid=0";
const strategySheetUrl = "https://docs.google.com/spreadsheets/d/1ONAQXCxwSMUjyoUAZ6Gg5JNu_jEGPu92l7L01RSSyko/gviz/tq?tqx=out:json&gid=0";

// ✅ スプレッドシートからデータを取得
async function fetchSheetData(sheetUrl, elementId) {
    try {
        const response = await fetch(sheetUrl);
        let text = await response.text();

        // ✅ Google Sheetsのレスポンスが正しいJSON形式かチェック
        if (!text.startsWith("/*O_o*/")) {
            throw new Error("Google Sheetsからのレスポンスが不正な形式です");
        }

        text = text.substring(47, text.length - 2); // JSONP形式を修正
        const json = JSON.parse(text);
        const message = json.table.rows[0]?.c[0]?.v || "情報がありません"; // セル A1 の値

        document.getElementById(elementId).querySelector("p").innerText = message;
    } catch (error) {
        console.error(`❌ ${elementId} のデータ取得エラー:`, error);
        document.getElementById(elementId).querySelector("p").innerText = "データ取得エラー";
    }
}

// ✅ データ取得 & グラフ表示
async function fetchDashboardData() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`ネットワークエラー: ${response.status}`);

        const data = await response.json();
        console.log('取得したデータ:', data);  // デバッグ用

        // ✅ API のレスポンスが適切か確認
        if (!data || !Array.isArray(data) || data.length < 7) {
            throw new Error("APIからのデータが不正な形式です");
        }

        // ✅ データの表示
        document.getElementById('date').textContent = data[0][1] || '--';
        document.getElementById('update-time').textContent = data[0][2] || '--:--';
        document.getElementById('bed-occupancy-value').textContent = data[1][1] ? data[1][1] + '%' : 'データ未取得';
        document.getElementById('ambulance-arrivals-value').textContent = data[2][1] ? data[2][1] + '台' : 'データ未取得';
        document.getElementById('inpatients-value').textContent = data[3][1] ? data[3][1] + '人' : 'データ未取得';
        document.getElementById('discharges-value').textContent = data[4][1] ? data[4][1] + '人' : 'データ未取得';
        document.getElementById('general-ward-value').textContent = data[5][1] ? data[5][1] + '/218 床' : 'データ未取得';
        document.getElementById('icu-value').textContent = data[6][1] ? data[6][1] + '/16 床' : 'データ未取得';

    } catch (error) {
        console.error('データ取得エラー:', error);
        alert('ダッシュボードデータの取得に失敗しました。URLまたはネットワーク接続を確認してください。');
    }
}

// ✅ 各カードのクリックイベント
document.getElementById('surgery-register-card').addEventListener('click', function() {
    window.open('https://docs.google.com/spreadsheets/d/1CHU8Cgxgg5IvL3nB6ackAdqxe7-CNkmWDvtYE-keuXI/edit', '_blank');
});

document.getElementById('duty-management-card').addEventListener('click', function() {
    window.open('https://docs.google.com/spreadsheets/d/e/2PACX-1vTfU1BN4pPg9rY9INF2Kea_OIq1Bya875QFvAmi87uRGYw1t3pH69Lx0msXIbbLtZ0XZqYMtJYsrIrR/pubhtml?gid=0&single=true', '_blank');
});

document.getElementById('covid-status-card').addEventListener('click', function() {
    window.open('https://docs.google.com/spreadsheets/d/1pgLCwJPxPpGO_-ro_J78QYqLzjrGHgTBKHL3ngybBbY/edit?gid=0#gid=0', '_blank');
});

// ✅ 初期化
fetchDashboardData();
fetchSheetData(presidentSheetUrl, "president-message");
fetchSheetData(strategySheetUrl, "strategy-message");
