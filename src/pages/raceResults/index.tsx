import React from "react";
import { RaceResult } from "../../types/RaceResult";
import Head from "next/head";
import Link from 'next/link';
import RaceResultsService from "../../lib/RaceResultsService";

export async function getServerSideProps() {
  try {
    const raceResultsService = new RaceResultsService();
    const raceResults = await raceResultsService.getAllRaceResults();

    return {
      props: {
        raceResults: JSON.parse(JSON.stringify(raceResults)),
      },
    };
  } catch (e) {
    console.error(e);
  }
  return {
    props: {
      raceResults: [],
    },
  };
}

export default function RaceResultsOverview({
  raceResults,
}: {
  raceResults: RaceResult[];
}) {
  return (
    <div className="container mt-4">
      <Head>
        <title>Rennergebnisse und Urkunden</title>
      </Head>
      <div className="row">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link href="/raceResults/form" passHref>
            <button className="btn btn-primary">Ergebnis eintragen</button>
          </Link>
        </div>
        {raceResults && raceResults.map((raceResult, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{raceResult.name}</h5>5
                <h6 className="card-subtitle mb-2 text-muted">
                  {raceResult.sportType}
                </h6>
                <p className="card-text">
                  {raceResult.date && new Date(raceResult.date).toLocaleDateString()}
                </p>
                {raceResult.certificatePath && (
                  <a
                    href={raceResult.certificatePath}
                    className="btn btn-outline-dark"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Urkunde ansehen
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
