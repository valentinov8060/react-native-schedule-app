import React, { useState, useEffect } from 'react';
import { FlatList, ActivityIndicator, Text, Button, View, StyleSheet } from 'react-native';

const MyList = () => {
  const data = [
    { mata_kuliah: 'Metodologi Penelitian', nama_kelas: 'A', sks: 3, hari: 'Senin', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 101' },
    { mata_kuliah: 'Sistem Informasi Geografis', nama_kelas: 'B', sks: 3, hari: 'Selasa', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 102' },
    { mata_kuliah: 'Komputasi Awan', nama_kelas: 'C', sks: 2, hari: 'Rabu', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 103' },
    { mata_kuliah: 'Software Development', nama_kelas: 'A', sks: 3, hari: 'Kamis', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 104' },
    { mata_kuliah: 'Software Testing and Quality Assurance', nama_kelas: 'B', sks: 3, hari: 'Jumat', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 105' },
    { mata_kuliah: 'Augmented Reality', nama_kelas: 'C', sks: 2, hari: 'Senin', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 106' },
    { mata_kuliah: 'Virtual Reality', nama_kelas: 'A', sks: 2, hari: 'Selasa', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 107' },
    { mata_kuliah: 'KKN', nama_kelas: 'B', sks: 1, hari: 'Rabu', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 108' },
    { mata_kuliah: 'Jaringan Komputer', nama_kelas: 'C', sks: 3, hari: 'Kamis', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 201' },
    { mata_kuliah: 'Basis Data', nama_kelas: 'A', sks: 3, hari: 'Jumat', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 202' },
    { mata_kuliah: 'Pemrograman Web', nama_kelas: 'B', sks: 3, hari: 'Senin', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 203' },
    { mata_kuliah: 'Sistem Keamanan Informasi', nama_kelas: 'C', sks: 2, hari: 'Selasa', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 204' },
    { mata_kuliah: 'Manajemen Proyek TI', nama_kelas: 'A', sks: 3, hari: 'Rabu', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 205' },
    { mata_kuliah: 'Interaksi Manusia dan Komputer', nama_kelas: 'B', sks: 3, hari: 'Kamis', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 206' },
    { mata_kuliah: 'Etika Profesi TI', nama_kelas: 'C', sks: 2, hari: 'Jumat', jam_mulai: '080000', jam_selesai: '090000', ruangan: 'Ruang 207' },
  ];

  const [courses, setCourses] = useState([]); // State to store displayed courses (current page)
  const [chunkedData, setChunkedData] = useState([]); // State to store data divided into chunks (pages)
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [allDataFetched, setAllDataFetched] = useState(false);

  const pageSize = 10; // Items per page

  const fetchData = async (pageNumber) => {
    // Replace with your actual data fetching logic (for demonstration, data is provided in the component)
    setIsLoading(true);
    const newData = data.slice((pageNumber - 1) * pageSize, pageNumber * pageSize); // Simulate fetching a page
    setCourses(newData);
    setAllDataFetched(newData.length < pageSize); // Check if all data fetched based on page size
    setIsLoading(false);
  };

  const showSchedules = (data, page, schedulesPerPage) => {
    if (page <= 0 || Math.ceil(data.length / schedulesPerPage) < page) {
      console.error("Invalid page number");
      return;
    }

    const startIndex = (page - 1) * schedulesPerPage;

    return data.slice(startIndex, startIndex + schedulesPerPage);
  }

  useEffect(() => {
    fetchData(currentPage); // Fetch initial data
  }, []);

  useEffect(() => {
    setChunkedData(chunkData(data, pageSize)); // Update chunked data when data changes
  }, [data]);

  const chunkData = (data, pageSize) => {
    const chunkedData = [];
    for (let i = 0; i < data.length; i += pageSize) {
      chunkedData.push(data.slice(i, i + pageSize));
    }
    return chunkedData;
  };

  const renderItem = ({ item }) => (
    <View>
      {/* Render your list item content here */}
      <Text>{item.courseName}</Text>
      <Text>{item.class}</Text>
      <Text>{item.sks}</Text>
      <Text>{item.day}</Text>
      <Text>{item.time}</Text>
      <Text>{item.room}</Text>
    </View>
  );

  const keyExtractor = (item) => item.key; // Assuming your data has a 'key' property

  const onEndReached = () => {
    if (!isLoading && !allDataFetched) {
      setCurrentPage(currentPage + 1);
      fetchData(currentPage + 1);
    }
  };

  const renderFooter = () => {
    if (isLoading) {
      return <ActivityIndicator/>;
    } else if (allDataFetched) {
      return <Text>No more data to load.</Text>;
    }
    return null;
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setCourses(chunkedData[currentPage - 1]); // Update displayed courses based on new page
    }
  };

  const handleNextPage = () => {
    if (currentPage < chunkedData.length) {
      setCurrentPage(currentPage + 1);
      setCourses(chunkedData[currentPage - 1]); // Update displayed courses based on new page
    }
  };

  return (
    <View>
      <FlatList
        data={courses} // Display courses from the 'courses' state
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
        ListFooterComponent={renderFooter}
      />
      <View>
        <Button title="Previous" onPress={handlePreviousPage} disabled={currentPage === 1} />
        <Button title="Next" onPress={handleNextPage} disabled={currentPage === chunkedData.length} />
      </View>
    </View>
  );
};


export default MyList;
