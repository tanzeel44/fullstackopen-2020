// module created for exercise 4.8
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');

const api = supertest(app);
const Blog = require('../models/Blog');

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = helper.initialBlogs
    .map((blog) => new Blog(blog));

  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

// test for exercise 4.8
test('get request returns correct number of blogs', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

// test for exercise 4.9
test('blog posts have a unique "id" identifier', async () => {
  const response = await api.get('/api/blogs');
  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined();
  });
});

// tests for exercise 4.10
test('new blog is saved to db following post request', async () => {
  const blog = {
    title: 'Test blog for testing api',
    author: 'Leshrac',
    url: 'https://www.leshrac.com/testBlog',
    likes: 0,
  };

  await api
    .post('/api/blogs')
    .send(blog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogList = await helper.blogsInDB();
  expect(blogList.length).toEqual(helper.initialBlogs.length + 1);

  const blogAuthors = blogList.map((blogPost) => blogPost.author);
  expect(blogAuthors).toContain('Leshrac');
});

// test for exercise 4.11
test('likes default to 0', async () => {
  const blog = {
    title: 'Test blog for testing api',
    author: 'Leshrac',
    url: 'https://www.leshrac.com/testBlog',
  };

  await api
    .post('/api/blogs')
    .send(blog);

  const blogList = await helper.blogsInDB();
  const { likes } = blogList[blogList.length - 1];
  expect(likes).toBe(0);
});

afterAll(() => {
  mongoose.connection.close();
});
