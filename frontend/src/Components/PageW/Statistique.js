import React, { useEffect, useState } from "react";
import { setDoc } from "../../store/DocSlice";
import { getDoc, getMyDoc } from "../../Api/DocApi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useDispatch } from "react-redux";
import { Loader } from "rsuite";

export default function Statistique() {
  const [Docs, setdocstate] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [chartsData, setChartsData] = useState(null);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true, // Afficher la légende
        position: "right", // Positionner la légende à droite
        labels: {
          boxWidth: 10, // Réduire la largeur de la case de la légende
          font: {
            size: 10, // Réduire la taille de la police de la légende
          },
        },
      },
      title: {
        display: true,
        text: "Types de documents les plus couramment générés",
      },
    },
    scales: {
      x: {
        ticks: {
          display: false, // Masquer les labels de l'axe X
        },
      },
      y: {
        ticks: {
          display: false, // Masquer les labels de l'axe Y
        },
      },
    },
    elements: {
      bar: {
        barThickness: 40, // Ajuster la largeur des barres de données
      },
    },
  };

  const colors = [
    "rgba(255, 99, 132, 0.5)",     // Manuels d'utilisation - Rouge
    "rgba(54, 162, 235, 0.5)",     // Guides de référence - Bleu
    "rgba(255, 206, 86, 0.5)",     // Spécifications techniques - Jaune
    "rgba(75, 192, 192, 0.5)",     // Schémas et plans - Vert
    "rgba(153, 102, 255, 0.5)",    // Procédures opérationnelles standard (SOP) - Violet
    "rgba(255, 159, 64, 0.5)",     // Rapports techniques - Orange
    "rgba(128, 128, 128, 0.5)",    // Cahiers des charges - Gris
    "rgba(0, 204, 102, 0.5)"       // Fiches techniques - Turquoise
  ];

  const dispatch = useDispatch();
  const getData = async () => {
    const datadoc = await getDoc();
    console.log(datadoc);
    dispatch(setDoc(datadoc));

    const labels = [];
    const datasets = [];

    datadoc.forEach((element) => {
      if (!labels.includes(element.type)) {
        labels.push(element.type);

        const backgroundColor = colors[labels.length - 1 % colors.length];

        datasets.push({
          label: element.type,
          data: [datadoc.filter((d) => d.type === element.type).length],
          backgroundColor,
        });
      }
    });

    setChartsData({
      labels,
      datasets,
    });

    setdocstate(datadoc);
    setisLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {isLoading && <Loader size="md" content="Loading.." />}
      <div>
        {chartsData && <Bar options={options} data={chartsData} />}
      </div>
    </>
  );
}
