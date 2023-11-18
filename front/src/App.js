import logo from './logo.svg';
import './App.css';
import { QueryClient, QueryClientProvider } from 'react-query'
import ArticlesList from './pages/articlesList';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';

const queryClient = new QueryClient()
const theme = createTheme({
});
function App() {
  return (

    <QueryClientProvider client={queryClient}>
      <MantineProvider >
        <ArticlesList />
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
