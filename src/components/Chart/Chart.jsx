import { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { fetchChartData } from '../../services/yahooFinance';
import styles from './Chart.module.css';

const PERIODS = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

export default function Chart({ symbol, isPositive }) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const [period, setPeriod] = useState('3M');
  const [loading, setLoading] = useState(true);
  const [crosshairData, setCrosshairData] = useState(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#848e9c',
        fontFamily: 'Inter, sans-serif',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: 'rgba(30, 35, 41, 0.5)' },
        horzLines: { color: 'rgba(30, 35, 41, 0.5)' },
      },
      crosshair: {
        mode: 0,
        vertLine: { color: 'rgba(132, 142, 156, 0.3)', width: 1, style: 3 },
        horzLine: { color: 'rgba(132, 142, 156, 0.3)', width: 1, style: 3 },
      },
      rightPriceScale: {
        borderColor: 'rgba(30, 35, 41, 0.5)',
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderColor: 'rgba(30, 35, 41, 0.5)',
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 5,
      },
      handleScroll: { vertTouchDrag: false },
      width: chartContainerRef.current.clientWidth,
      height: 380,
    });

    chartRef.current = chart;

    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !seriesRef.current) {
        setCrosshairData(null);
        return;
      }
      const data = param.seriesData.get(seriesRef.current);
      if (data) {
        setCrosshairData({ value: data.value, time: param.time });
      }
    });

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  const loadData = useCallback(async () => {
    if (!chartRef.current || !symbol) return;

    setLoading(true);
    setCrosshairData(null);

    try {
      const data = await fetchChartData(symbol, period);
      if (!chartRef.current) return;

      if (seriesRef.current) {
        chartRef.current.removeSeries(seriesRef.current);
        seriesRef.current = null;
      }

      const color = isPositive ? '#0ecb81' : '#f6465d';

      const series = chartRef.current.addAreaSeries({
        lineColor: color,
        topColor: color + '26',
        bottomColor: 'transparent',
        lineWidth: 2,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 4,
        crosshairMarkerBorderColor: color,
        crosshairMarkerBackgroundColor: '#0b0e11',
        priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
      });

      const chartData = data.map(d => ({
        time: d.time,
        value: d.close,
      }));

      series.setData(chartData);
      seriesRef.current = series;

      chartRef.current.timeScale().applyOptions({
        timeVisible: period === '1D' || period === '1W',
      });
      chartRef.current.timeScale().fitContent();
    } catch (err) {
      console.error('Chart load error:', err);
    } finally {
      setLoading(false);
    }
  }, [symbol, period, isPositive]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBar}>
        <div className={styles.periodBar}>
          {PERIODS.map(p => (
            <button
              key={p}
              className={`${styles.periodBtn} ${period === p ? styles.active : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>
        {crosshairData && (
          <div className={styles.crosshairInfo}>
            <span className={isPositive ? styles.green : styles.red}>
              ${crosshairData.value?.toFixed(2)}
            </span>
          </div>
        )}
      </div>
      <div className={styles.chartArea}>
        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner} />
          </div>
        )}
        <div ref={chartContainerRef} className={styles.chart} />
      </div>
    </div>
  );
}
