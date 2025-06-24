import React from 'react';
import PageContent from '../../../components/page-content/PageContent';

const CreateBlogPage = (): JSX.Element => {
  return (
    <PageContent>
      <div>
        <h1>Create New Blog Post</h1>

        {/* TODO: Add BlogEditor component here */}
        <div>
          <p>This will contain the blog creation form</p>
        </div>

        {/* TODO: Add form with Save/Cancel buttons */}
      </div>
    </PageContent>
  );
};

export default CreateBlogPage;
