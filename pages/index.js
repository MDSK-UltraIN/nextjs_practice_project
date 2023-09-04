// import { useEffect, useState } from 'react'
import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";
import Head from "next/head";

function HomePage(props) {

  return (
    <>
      <Head>
        <title>React Meetup</title>
        <meta name="description" content="NextJS demo project" />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  )
}

// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   // fetch data from an API
//   return {
//     props: {
//       meetups: dummyMeetups
//     }
//   };
// }

export async function getStaticProps() {
  // fetch data from API
  const client = await MongoClient.connect('mongodb+srv://test:testUser@cluster0.bewftjo.mongodb.net/meetups?retryWrites=true&w=majority')
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map(meetup => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString()
      }))
    },
    revalidate: 2 // second
  };
}

export default HomePage;