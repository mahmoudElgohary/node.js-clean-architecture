/* eslint-disable no-unused-expressions */
import chai from 'chai';
import sinon from 'sinon';
import faker from 'faker';

import userType from '../../../../src/entities/userType';
import addUserType from '../../../../application/use_cases/userType/add';
import findAll from '../../../../application/use_cases/userType/findAll';
import findById from '../../../../application/use_cases/userType/findById';
import postDbRepository from '../../../../application/repositories/userTypeDbRepository';

const { expect } = chai;

let dbRepository = null;

describe('Use cases', () => {
  beforeEach(() => {
    dbRepository = postDbRepository();
  });

  describe('Fetch a specific userType', () => {
    it('should fetch a userType by id', () => {
      const stubPost = {
        title: faker.name.findName(),
        description: faker.name.findName(),
        createdAt: faker.date.past(),
        isPublished: false,
        userId: faker.random.uuid()
      };
      const correspondingPost = userType({
        title: stubPost.title,
        description: stubPost.description,
        createdAt: stubPost.createdAt,
        isPublished: stubPost.isPublished,
        userId: stubPost.userId,
        postRepository: dbRepository
      });
      const stubRepositoryFindById = sinon
        .stub(dbRepository, 'findById')
        .returns(correspondingPost);
      const fetchedPost = findById('5fb1b12a6ac3e23493ac82e4', dbRepository);
      expect(stubRepositoryFindById.calledOnce).to.be.true;
      sinon.assert.calledWith(
        stubRepositoryFindById,
        '5fb1b12a6ac3e23493ac82e4'
      );
      expect(fetchedPost).to.eql(correspondingPost);
    });
  });

  describe('Fetch all posts', () => {
    it('should fetch all the posts succesfully', () => {
      const stubRepositoryFetchAll = sinon
        .stub(dbRepository, 'findAll')
        .returns(['post1', 'post2']);
      const posts = findAll('602c13e0cfe08b794e1b287b', dbRepository);
      expect(stubRepositoryFetchAll.calledOnce).to.be.true;
      expect(posts).to.eql(['post1', 'post2']);
    });
  });

  describe('Add new userType', () => {
    it('should add a new userType succesfully', () => {
      const stubValue = {
        title: faker.name.findName(),
        description: faker.name.findName(),
        createdAt: faker.date.past(),
        isPublished: false,
        userId: faker.random.uuid()
      };
      const pesristedPost = userType({
        title: stubValue.title,
        description: stubValue.description,
        createdAt: stubValue.createdAt,
        isPublished: stubValue.isPublished,
        userId: stubValue.userId
      });
      const stubRepositoryAdd = sinon
        .stub(dbRepository, 'add')
        .returns(pesristedPost);
      const newPost = addUserType({
        title: stubValue.title,
        description: stubValue.description,
        createdAt: stubValue.createdAt,
        isPublished: stubValue.isPublished,
        userId: stubValue.userId,
        postRepository: dbRepository
      });
      expect(stubRepositoryAdd.calledOnce).to.be.true;
      expect(newPost.getTitle()).equals(stubValue.title);
      expect(newPost.getDescription()).equals(stubValue.description);
      expect(newPost.getCreatedAt()).equals(stubValue.createdAt);
      expect(newPost.isPublished()).equals(stubValue.isPublished);
      expect(newPost.getUserId()).equals(stubValue.userId);
    });
  });
});
