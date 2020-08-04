import { TestBed } from '@angular/core/testing';

import { UploadDownloadService } from './upload-dowload.service';

describe('UploadDowloadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UploadDownloadService = TestBed.get(UploadDownloadService);
    expect(service).toBeTruthy();
  });
});
